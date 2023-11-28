import { EditorView } from 'prosemirror-view';
import { EditorState, Selection, Plugin, PluginKey } from 'prosemirror-state';
import { getEditable } from '../core/meta';
import { GptOptions } from '../react-components/ai/type';
import { DEFAULT_CONTINUE_WRITING, DEFAULT_GPT_PROMPT } from './constants';
import { getTextContentFromNodes, posToOffsetRect } from '../core';
import { createPortal, getPortal } from '../plugin-portal';

export type AIOptions = {
  disable?: boolean;
  enableQuickContinueWriting?: boolean;
  enableQuickQuestion?: boolean;
  enableAIChat?: boolean;
  onAIChatOpenChange?: (open: boolean, selection?: Selection) => void;
  onAttachAIChat?: (protal: HTMLElement) => void;
};

export const AIPluginKey = new PluginKey('plugin-ai');

const defaultAIOptions: AIOptions = {
  disable: false,
  enableAIChat: true
};

export function AI(options: AIOptions = defaultAIOptions) {
  const isAIContinueWriting = segments('+', 2);
  const isAIAsking = segments('?', 2);

  options = {
    ...defaultAIOptions,
    ...options
  };

  let editorView: EditorView | null = null;

  return new Plugin({
    key: AIPluginKey,
    view(view) {
      editorView = view;

      const portal = createPortal(view.state, AIPluginKey);

      options.onAttachAIChat?.(portal);

      return {
        destroy() {
          editorView = null;
        }
      };
    },
    props: {
      handleKeyDown(view, event) {
        if (options.enableAIChat && event.code === 'Space') {
          const selection = view.state.selection;
          const nodeText = getTextContentFromNodes(selection.$from);

          if (nodeText.length === 0) {
            const selection = view.state.selection;
            const portal = getPortal(view.state, AIPluginKey);

            if (!portal) {
              return false;
            }

            const rect = posToOffsetRect(view, selection.from, selection.to);

            portal.style.display = 'block';
            portal.style.top = rect.y + 'px';
            portal.style.left = rect.x + 'px';
            portal.style.width = rect.width + 'px';
            portal.style.height = rect.height + 'px';

            options.onAIChatOpenChange?.(true, selection);

            return true;
          }

          return false;
        }
      }
    },
    state: {
      init() {},
      apply(transaction, value, oldState, newState) {
        const active = getEditable(transaction);

        if (!transaction.docChanged || !active || !editorView) {
          return;
        }

        if (options.enableQuickContinueWriting) {
          const text = getPrevText(newState, { chars: 2 });

          if (isAIContinueWriting(text[1]) && text === '++') {
            const question = getPrevText(newState, {
              chars: 5000
            });
            AIContinueWriting(editorView, question);
          }
        }

        if (options.enableQuickQuestion) {
          const text = getPrevText(newState, { chars: 2 });

          if (isAIAsking(text[1]) && text === '??') {
            const question = getPrevText(newState, {
              chars: 5000
            });
            AIAsking(editorView, question);
          }
        }

        return value;
      }
    }
  });
}

function AIContinueWriting(view: EditorView, message: string, config?: GptOptions) {
  dispathAICommand(view, message, {
    config: config?.config,
    systemMessage: DEFAULT_CONTINUE_WRITING
  });
}

function AIAsking(view: EditorView, message: string, config?: GptOptions) {
  dispathAICommand(view, message, {
    config: config?.config,
    systemMessage: DEFAULT_GPT_PROMPT
  });
}

function dispathAICommand(view: EditorView, question: string, options?: GptOptions) {
  // TODO
}

export const getPrevText = (
  state: EditorState,
  {
    chars,
    offset = 0
  }: {
    chars: number;
    offset?: number;
  }
) => {
  return state.doc.textBetween(
    Math.max(0, state.selection.from - chars),
    state.selection.from - offset,
    '\n'
  );
};

const segments = (token: string, count: number) => {
  let s = '';

  const reset = () => {
    s = '';
  };

  return (input: string) => {
    if (input !== token) {
      reset();
      return false;
    }

    s += input;

    if (s.length < count) {
      return false;
    }

    reset();

    return true;
  };
};
