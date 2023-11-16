import mitt, { Emitter, Handler } from 'mitt';
import { EditorView } from 'prosemirror-view';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import debounce from 'lodash/debounce';

export type { Handler };
export type EventMap = {
  mounted: EditorView;
  destory: EditorView;

  transaction: Transaction;

  viewUpdate: {
    view: EditorView;
    prevState: EditorState;
  };

  focus: {
    view: EditorView;
    event: FocusEvent;
  };
  blur: {
    view: EditorView;
    event: FocusEvent;
  };
};

export type EventPluginState = {
  emitter: Emitter<EventMap>;
};

export const EventPluginKey = new PluginKey<EventPluginState>('plugin-event');

export function getEventEmitter(state: EditorState) {
  return EventPluginKey.getState(state)?.emitter;
}

export const event = () => {
  const emitter = mitt<EventMap>();

  const debounceTransactionChange = debounce(onTransationChange, 200);

  const plugin = new Plugin<EventPluginState>({
    key: EventPluginKey,
    props: {
      handleDOMEvents: {
        focus: (view, event) => {
          emitter.emit('focus', {
            view,
            event
          });
          return false;
        },
        blur: (view, event) => {
          emitter.emit('blur', {
            view,
            event
          });
          return false;
        }
      }
    },
    state: {
      // Initialize the state
      init: () => {
        return {
          emitter
        };
      },
      apply(tr, value) {
        if (tr.docChanged) {
          debounceTransactionChange(tr, value);
        }

        return value;
      }
    },
    view(view) {
      emitter.emit('mounted', view);

      return {
        update(view, prevState) {
          emitter.emit('viewUpdate', {
            view,
            prevState
          });
        },
        destroy() {
          emitter.emit('destory', view);
        }
      };
    }
  });

  return plugin;
};

function onTransationChange(tr: Transaction, state: EventPluginState) {
  state.emitter.emit('transaction', tr);
}
