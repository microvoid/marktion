import { EditorView } from 'prosemirror-view';
import { Command } from 'prosemirror-state';

import * as rawCommands from './commands';

export type Commands = typeof rawCommands;

export type ChainedCommands = {
  [Item in keyof Commands]: (...args: Parameters<Commands[Item]>) => ChainedCommands;
} & {
  run: () => boolean;
};

export function createChain(view: EditorView) {
  const commands: Command[] = [];

  const chain = {
    run: () => {
      return chainCommands(...commands)(view.state, view.dispatch.bind(view), view);
    },
    ...Object.fromEntries(
      Object.entries(rawCommands).map(([name, command]) => {
        const wrapper = (...args: never[]) => {
          const cmd = (command as (...args: never[]) => Command)(...args);
          commands.push(cmd);

          return chain;
        };

        return [name, wrapper];
      })
    )
  } as ChainedCommands;

  return chain;
}

function chainCommands(...commands: readonly Command[]): Command {
  return function (state, dispatch, view) {
    let res = true;

    for (let i = 0; i < commands.length; i++)
      if (!commands[i](state, dispatch, view)) {
        res = false;
      }

    return res;
  };
}
