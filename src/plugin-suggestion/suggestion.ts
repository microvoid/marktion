import { Range, posToOffsetRect } from '../core';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

import { SuggestionMatch, findSuggestionMatch } from './findSuggestionMatch.js';
import { createPortal } from '../plugin-portal';

export interface SuggestionOptions {
  pluginKey?: PluginKey;
  char?: string;
  allowSpaces?: boolean;
  allowedPrefixes?: string[] | null;
  startOfLine?: boolean;
  decorationTag?: string;
  decorationClass?: string;
  allow?: (props: {
    transaction: Transaction;
    state: EditorState;
    match: SuggestionMatch;
  }) => boolean;
  onAttach?: (protal: HTMLElement) => void;
  onChange?: (open: boolean, props: SuggestionProps, state?: EditorState) => void;
  onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
}

export interface SuggestionProps {
  state: EditorState;
  range: Range;
  query: string;
  text: string;
}

export interface SuggestionKeyDownProps {
  view: EditorView;
  event: KeyboardEvent;
  range: Range;
}

export type SuggesttionPluginState = {
  active: boolean;
  range: Range;
  query: null | string;
  text: null | string;
  composing: boolean;
  decorationId?: string | null;
};

export const SuggestionPluginKey = new PluginKey<SuggesttionPluginState>('plugin-suggestion');

export const defaultAllow: SuggestionOptions['allow'] = ({ transaction, match }) => {
  return Boolean(transaction.docChanged && match);
};

export function suggestion({
  pluginKey = SuggestionPluginKey,
  char = '@',
  allowSpaces = false,
  allowedPrefixes = [' '],
  startOfLine = false,
  decorationTag = 'span',
  decorationClass = 'suggestion',
  allow = defaultAllow,
  onAttach,
  onChange,
  onKeyDown
}: SuggestionOptions) {
  let props: SuggestionProps | undefined;
  let editorView: EditorView | null = null;

  const plugin = new Plugin<SuggesttionPluginState>({
    key: pluginKey,

    view(view) {
      const portal = createPortal(view.state, pluginKey);

      onAttach?.(portal);

      return {
        update: async (view, prevState) => {
          editorView = view;

          const prev = pluginKey.getState(prevState);
          const next = pluginKey.getState(view.state);

          // See how the state changed
          const moved = prev.active && next.active && prev.range.from !== next.range.from;
          const started = !prev.active && next.active;
          const stopped = prev.active && !next.active;
          const changed = !started && !stopped && prev.query !== next.query;
          const handleStart = started || moved;
          const handleChange = changed && !moved;
          const handleExit = stopped || moved;

          // Cancel when suggestion isn't active
          if (!handleStart && !handleChange && !handleExit) {
            return;
          }

          const state = handleExit && !handleStart ? prev : next;

          props = {
            state: view.state,
            range: state.range,
            query: state.query,
            text: state.text
          };

          const rect = posToOffsetRect(view, props.range.from, props.range.to);

          portal.style.display = 'block';
          portal.style.top = rect.y + 'px';
          portal.style.left = rect.x + 'px';
          portal.style.width = rect.width + 'px';
          portal.style.height = rect.height + 'px';

          if (handleExit) {
            portal.style.display = 'none';
            return onChange?.(false, props, editorView.state);
          }

          onChange?.(true, props, editorView.state);
        },

        destroy: () => {
          if (!props) {
            return;
          }

          onChange?.(false, props);
        }
      };
    },

    state: {
      // Initialize the plugin's internal state.
      init() {
        return {
          active: false,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: false
        };
      },

      // Apply changes to the plugin state from a view transaction.
      apply(transaction, prev, oldState, state) {
        if (!editorView) {
          return prev;
        }

        const { composing } = editorView;
        const { selection } = transaction;
        const { empty, from } = selection;
        const next = { ...prev };

        next.composing = composing;

        // We can only be suggesting if the view is editable, and:
        //   * there is no selection, or
        //   * a composition is active (see: https://github.com/ueberdosis/tiptap/issues/1449)
        if (editorView.editable && (empty || editorView.composing)) {
          // Reset active state if we just left the previous suggestion range
          if ((from < prev.range.from || from > prev.range.to) && !composing && !prev.composing) {
            next.active = false;
          }

          // Try to match against where our cursor currently is
          const match = findSuggestionMatch({
            char,
            allowSpaces,
            allowedPrefixes,
            startOfLine,
            $position: selection.$from
          });

          const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;

          // If we found a match, update the current state to show it
          if (allow!({ transaction, state, match })) {
            next.active = true;
            next.decorationId = prev.decorationId ? prev.decorationId : decorationId;
            next.range = match!.range;
            next.query = match!.query;
            next.text = match!.text;
          } else {
            next.active = false;
          }
        } else {
          next.active = false;
        }

        // Make sure to empty the range if suggestion is inactive
        if (!next.active) {
          next.decorationId = null;
          next.range = { from: 0, to: 0 };
          next.query = null;
          next.text = null;
        }

        return next;
      }
    },

    props: {
      // Call the keydown hook if suggestion is active.
      handleKeyDown(view, event) {
        const { active, range } = pluginKey.getState(view.state);

        if (!active) {
          return false;
        }

        return onKeyDown?.({ view, event, range }) || false;
      },

      // Setup decorator on the currently active suggestion.
      decorations(state) {
        const { active, range, decorationId } = pluginKey.getState(state);

        if (!active) {
          return null;
        }

        return DecorationSet.create(state.doc, [
          Decoration.inline(range.from, range.to, {
            nodeName: decorationTag,
            class: decorationClass,
            'data-decoration-id': decorationId
          })
        ]);
      }
    }
  });

  return plugin;
}
