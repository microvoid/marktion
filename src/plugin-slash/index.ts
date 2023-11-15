import mitt, { Emitter } from 'mitt';
import { EditorView } from 'prosemirror-view';
import { EditorState, Plugin, PluginKey, PluginView } from 'prosemirror-state';
import {
  addSuggester,
  ChangeReason,
  SuggestChangeHandlerProps,
  Suggester
} from '../plugin-suggest';
import { createPortal, getPortal } from '../plugin-portal';

export type SlashPluginState = {
  event: Emitter<SlashEvent>;
};
export type SlashEvent = {
  onOpenChange: {
    open: boolean;
    changeDetails?: SuggestChangeHandlerProps;
  };
  onChange: {
    changeDetails: SuggestChangeHandlerProps;
  };
};

export const SlashPluginKey = new PluginKey<SlashPluginState>('plugin-slash');

export type CreateSlashOptions = {
  view?: (view: EditorView) => PluginView;
};

export function getSlashEvent(state: EditorState) {
  return SlashPluginKey.getState(state);
}

export function createSlash(options: CreateSlashOptions = {}) {
  const event = mitt<SlashEvent>();

  const slash: Suggester = {
    disableDecorations: false,
    appendTransaction: false,
    suggestTag: 'span',
    name: 'slash',
    // validPrefixCharacters: /.?/,
    char: '/',
    onChange(props) {
      if (props.changeReason === ChangeReason.Start) {
        onSlashOpen(props, {
          event
        });
        return;
      }

      if (props.changeReason === ChangeReason.Move || props.changeReason === ChangeReason.Text) {
        onSlashUpdate(props, {
          event
        });
        return;
      }

      onSlashClose(props, {
        event
      });
    }
  };

  const plugin = new Plugin<SlashPluginState>({
    key: SlashPluginKey,
    state: {
      init(_, state) {
        addSuggester(state, slash);

        return {
          event
        };
      },
      apply(tr, value) {
        return value;
      }
    },
    view(view) {
      createPortal(view.state, SlashPluginKey);
      return options.view?.(view) || {};
    }
  });

  return plugin;
}

function onSlashOpen(props: SuggestChangeHandlerProps, slashState: SlashPluginState) {
  const portal = getPortal(props.view.state, SlashPluginKey);

  if (!portal) return;

  const parent = props.view.dom;
  const parentRect = parent.getBoundingClientRect();
  const coords = props.view.coordsAtPos(props.range.from);
  const rect = getCursurRect(
    coords.left - parentRect.left + parent.scrollLeft,
    coords.top - parentRect.top + parent.scrollTop,
    1,
    coords.bottom - coords.top
  );

  portal.style.top = rect.y + 'px';
  portal.style.left = rect.x + 'px';
  portal.style.width = rect.width + 'px';
  portal.style.height = rect.height + 'px';

  slashState.event.emit('onOpenChange', {
    open: true,
    changeDetails: props
  });
}

function onSlashClose(props: SuggestChangeHandlerProps, slashState: SlashPluginState) {
  slashState.event.emit('onOpenChange', {
    open: false
  });
}

function onSlashUpdate(props: SuggestChangeHandlerProps, slashState: SlashPluginState) {
  slashState.event.emit('onChange', {
    changeDetails: props
  });
}

function getCursurRect(x: number, y: number, width: number, height: number) {
  return new DOMRect(x, y, width, height);
}
