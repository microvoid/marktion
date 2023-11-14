import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey, PluginView } from 'prosemirror-state';
import { addSuggester, Suggester } from '../plugin-suggest';
import { createPortal } from '../plugin-portal';

export const SlashPluginKey = new PluginKey('plugin-slash');

export type SlashOptions = {
  view?: (view: EditorView) => PluginView;
};

export function createSlash(options: SlashOptions = {}) {
  const slash: Suggester = {
    disableDecorations: true,
    appendTransaction: false,
    suggestTag: 'span',
    name: 'slash',
    // validPrefixCharacters: /.?/,
    char: '/',
    onChange(props) {
      console.log(props);
    }
  };

  const plugin = new Plugin({
    key: SlashPluginKey,
    state: {
      init(_, state) {
        addSuggester(state, slash);
      },
      apply(tr, value) {
        return value;
      }
    },
    view(view) {
      createPortal(view.state, SlashPluginKey);
      options.view?.(view);
      return {};
    }
  });

  return plugin;
}

function suggestSlash() {}
