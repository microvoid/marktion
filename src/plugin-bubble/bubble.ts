import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import debounce from 'lodash/debounce';
import { createPortal, getPortal } from '../plugin-portal';
import { isActive, posToOffsetRect } from '../core';

export const BubblePluginKey = new PluginKey<BubblePluginState>('plugin-bubble');
export type BubblePluginState = {
  open: boolean;
};

export type BubbleChangeState = {
  view: EditorView;
  state: EditorState;
  prevState?: EditorState;
  from: number;
  to: number;
};

export type BubbleOptions = {
  delay?: number;
  onOpenChange?: (open: boolean, changeState?: BubbleChangeState) => void;
  onAttach?: (protal: HTMLElement) => void;
};

export function getBubbleState(state: EditorState) {
  return BubblePluginKey.getState(state);
}

export const bubble = (options: BubbleOptions = {}) => {
  const bubbleState: BubblePluginState = {
    open: false
  };

  const debounceChange = debounce((view: EditorView, changeState: BubbleChangeState) => {
    const portal = getPortal(view.state, BubblePluginKey);

    if (!portal) {
      return;
    }

    const rect = posToOffsetRect(view, changeState.from, changeState.to);

    portal.style.display = 'block';
    portal.style.top = rect.y + 'px';
    portal.style.left = rect.x + 'px';
    portal.style.width = rect.width + 'px';
    portal.style.height = rect.height + 'px';

    bubbleState.open = true;
    options.onOpenChange?.(true, changeState);
  }, options.delay || 200);

  const close = (view: EditorView) => {
    const portal = getPortal(view.state, BubblePluginKey);

    if (!portal) {
      return;
    }
    portal.style.display = 'none';
    options.onOpenChange?.(false);
  };

  return new Plugin<BubblePluginState>({
    key: BubblePluginKey,
    props: {
      handleDOMEvents: {
        blur(view) {
          // be friendly to the blur event of outside click behavior, such as bubble btn;
          setTimeout(() => {
            if (!view.hasFocus()) {
              close(view);
            }
          }, 200);
        }
      }
    },
    state: {
      init() {
        return bubbleState;
      },
      apply(tr, value) {
        return value;
      }
    },
    view(view) {
      const portal = createPortal(view.state, BubblePluginKey);

      options.onAttach?.(portal);

      return {
        update(view, prevState) {
          const changeState = getBubbleChangeState(view, prevState);

          if (changeState) {
            debounceChange(view, changeState);
          } else {
            close(view);
          }
        }
      };
    }
  });
};

function getBubbleChangeState(view: EditorView, prevState: EditorState): BubbleChangeState | null {
  const hasValidSelection = view.state.selection.$from.pos !== view.state.selection.$to.pos;

  if (!hasValidSelection) {
    return null;
  }

  const selectionChanged = !prevState?.selection.eq(view.state.selection);
  const docChanged = !prevState?.doc.eq(view.state.doc);

  if (!selectionChanged && !docChanged) {
    return null;
  }

  const { state, composing } = view;
  const { selection } = state;

  const isSame = !selectionChanged && !docChanged;

  if (composing || isSame) {
    return null;
  }

  if (isActive(view.state, 'image')) {
    return null;
  }

  if (selection.$from.node() !== selection.$to.node()) {
    return null;
  }

  if (selection.content().size <= 0) {
    return null;
  }

  // support for CellSelections
  const { ranges } = selection;
  const from = Math.min(...ranges.map(range => range.$from.pos));
  const to = Math.max(...ranges.map(range => range.$to.pos));

  return {
    view,
    state,
    prevState,
    from,
    to
  };
}
