import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';

import { createChainableState } from './helpers';
import {
  AnyCommands,
  CanCommands,
  ChainedCommands,
  CommandProps,
  SingleCommands
} from './types.js';

export class CommandManager {
  rawCommands: AnyCommands;
  view: EditorView;

  constructor(public props: { view: EditorView; commands: AnyCommands }) {
    this.rawCommands = props.commands;
    this.view = props.view;
  }

  get state(): EditorState {
    return this.view.state;
  }

  get commands(): SingleCommands {
    const { rawCommands, state, view } = this;
    const { tr } = state;
    const props = this.buildProps(tr);

    return Object.fromEntries(
      Object.entries(rawCommands).map(([name, command]) => {
        const method = (...args: any[]) => {
          const callback = command(...args)(props);

          if (!tr.getMeta('preventDispatch')) {
            view.dispatch(tr);
          }

          return callback;
        };

        return [name, method];
      })
    ) as unknown as SingleCommands;
  }

  get chain(): () => ChainedCommands {
    return () => this.createChain();
  }

  get can(): () => CanCommands {
    return () => this.createCan();
  }

  public createChain(startTr?: Transaction, shouldDispatch = true): ChainedCommands {
    const { rawCommands, state, view } = this;
    const callbacks: boolean[] = [];
    const hasStartTransaction = !!startTr;
    const tr = startTr || state.tr;

    const run = () => {
      if (!hasStartTransaction && shouldDispatch && !tr.getMeta('preventDispatch')) {
        view.dispatch(tr);
      }

      return callbacks.every(callback => callback === true);
    };

    const chain = {
      ...Object.fromEntries(
        Object.entries(rawCommands).map(([name, command]) => {
          const chainedCommand = (...args: never[]) => {
            const props = this.buildProps(tr, shouldDispatch);
            const callback = command(...args)(props);

            callbacks.push(callback);

            return chain;
          };

          return [name, chainedCommand];
        })
      ),
      run
    } as unknown as ChainedCommands;

    return chain;
  }

  public createCan(startTr?: Transaction): CanCommands {
    const { rawCommands, state } = this;
    const dispatch = false;
    const tr = startTr || state.tr;
    const props = this.buildProps(tr, dispatch);
    const formattedCommands = Object.fromEntries(
      Object.entries(rawCommands).map(([name, command]) => {
        return [name, (...args: never[]) => command(...args)({ ...props, dispatch: undefined })];
      })
    ) as unknown as SingleCommands;

    return {
      ...formattedCommands,
      chain: () => this.createChain(tr, dispatch)
    } as CanCommands;
  }

  public buildProps(tr: Transaction, shouldDispatch = true): CommandProps {
    const { rawCommands, view, state } = this;

    const props: CommandProps = {
      tr,
      view,
      state: createChainableState({
        state,
        transaction: tr
      }),
      dispatch: shouldDispatch ? () => undefined : undefined,
      chain: () => this.createChain(tr, shouldDispatch),
      can: () => this.createCan(tr),
      get commands() {
        return Object.fromEntries(
          Object.entries(rawCommands).map(([name, command]) => {
            return [name, (...args: never[]) => command(...args)(props)];
          })
        ) as unknown as SingleCommands;
      }
    };

    return props;
  }
}
