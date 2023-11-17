import { PluginKey } from 'prosemirror-state';
import { SuggestionOptions, suggestion } from '../plugin-suggestion';

export const SlashPluginKey = new PluginKey('plugin-slash');

export function slash(options: SuggestionOptions) {
  return suggestion({
    ...options,
    pluginKey: SlashPluginKey
  });
}
