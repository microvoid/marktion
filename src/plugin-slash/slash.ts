import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import {
  addSuggester,
  ChangeReason,
  SuggestChangeHandlerProps,
  Suggester
} from '../plugin-suggest';
import { createPortal, getPortal } from '../plugin-portal';
import { posToOffsetRect } from '../core';

export type SlashEvent = {
  onOpenChange: {
    open: boolean;
    changeDetails?: SuggestChangeHandlerProps;
  };
  onChange: {
    changeDetails: SuggestChangeHandlerProps;
  };
};

export const SlashPluginKey = new PluginKey('plugin-slash');

export type SlashOptions = {
  onOpenChange?: (open: boolean, changeDetails?: SuggestChangeHandlerProps) => void;
  onAttach?: (protal: HTMLElement) => void;
};

export function getSlashEvent(state: EditorState) {
  return SlashPluginKey.getState(state);
}

export function slash(options: SlashOptions = {}) {
  const slash: Suggester = {
    disableDecorations: false,
    appendTransaction: false,
    suggestTag: 'span',
    name: 'slash',
    // validPrefixCharacters: /.?/,
    char: '/',
    onChange(props) {
      const portal = getPortal(props.view.state, SlashPluginKey);

      if (!portal) return;

      if (props.changeReason === ChangeReason.Start) {
        const rect = posToOffsetRect(props.view, props.range.from, props.range.from);

        portal.style.top = rect.y + 'px';
        portal.style.left = rect.x + 'px';
        portal.style.width = rect.width + 'px';
        portal.style.height = rect.height + 'px';

        options.onOpenChange?.(true, props);
        return;
      }

      if (props.changeReason === ChangeReason.Move || props.changeReason === ChangeReason.Text) {
        options.onOpenChange?.(true, props);
        return;
      }

      options.onOpenChange?.(false);
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
      const portal = createPortal(view.state, SlashPluginKey);

      options.onAttach?.(portal);

      return {};
    }
  });

  return plugin;
}
