import { Extension } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, posToDOMRect, getTextContentFromNodes } from '@tiptap/core';
import { DEFAULT_CONTINUE_WRITING, DEFAULT_GPT_PROMPT } from './constants';
import { createIntergrateExtension } from '../plugins';
import { AIOptions, AIStorage } from './interface';
import { ChatPanel } from './ui-chat-panel';
import { useRootElRef } from '../hooks';
import { GptOptions } from './type';

export const AIPlugin = createIntergrateExtension((options: AIOptions) => {
  const isAIContinueWriting = segments('+', 2);
  const isAIAsking = segments('?', 2);

  const AIExtensions = Extension.create<AIOptions, AIStorage>({
    name: 'ai',

    addOptions() {
      return {
        enableAIChat: true,
        enableQuickQuestion: false,
        enableQuickContinueWriting: false,
        openai: options.openai
      };
    },

    addStorage() {
      return {
        AIContinueWriting: (editor: Editor, message) => {
          dispathAICommand(editor, message, {
            config: this.options.openai,
            systemMessage: DEFAULT_CONTINUE_WRITING
          });
        },
        AIAsking: (editor: Editor, message) => {
          dispathAICommand(editor, message, {
            config: this.options.openai,
            systemMessage: DEFAULT_GPT_PROMPT
          });
        },
        AIChat: (editor: Editor) => {
          const view = editor.view;
          const selection = editor.state.selection;

          const rect = posToDOMRect(view, selection.from, selection.to);

          wrapperElRef.update({
            open: true,
            rect,
            config: this.options.openai
          });
        }
      };
    },

    onTransaction({ transaction }) {
      const editor = this.editor;
      const active = editor.isEditable;

      if (!transaction.docChanged || !active) {
        return;
      }

      const storage = editor.storage.ai as AIStorage;

      if (this.options.enableQuickContinueWriting) {
        const text = getPrevText(editor, { chars: 2 });

        if (isAIContinueWriting(text[1]) && text === '++') {
          const question = getPrevText(editor, {
            chars: 5000
          });
          storage.AIContinueWriting(editor, question);
        }
      }

      if (this.options.enableQuickQuestion) {
        const text = getPrevText(editor, { chars: 2 });

        if (isAIAsking(text[1]) && text === '??') {
          const question = getPrevText(editor, {
            chars: 5000
          });
          storage.AIAsking(editor, question);
        }
      }
    },

    addProseMirrorPlugins() {
      const editor = this.editor;
      const { enableAIChat } = this.options;

      return [
        new Plugin({
          key: new PluginKey('ai-event-handler'),
          props: {
            handleKeyDown(_, event) {
              if (enableAIChat && event.code === 'Space') {
                const nodeText = getTextContentFromNodes(editor.state.selection.$from);

                if (nodeText.length === 0) {
                  const storage = editor.storage.ai as AIStorage;
                  storage.AIChat(editor);
                  return true;
                }

                return false;
              }
            }
          }
        })
      ];
    }
  });

  const wrapperElRef: ViewWrapperProps['wrapperRef'] = {
    update: () => {}
  };

  return {
    extension: AIExtensions,
    view({ editor }) {
      return <ViewWrapper editor={editor} wrapperRef={wrapperElRef} />;
    }
  };
});

type ViewWrapperProps = {
  wrapperRef: {
    update: (options: {
      open?: boolean;
      rect: DOMRect | null;
      config: GptOptions['config'];
    }) => void;
  };
  editor: Editor;
};

function ViewWrapper({ editor, wrapperRef }: ViewWrapperProps) {
  const rootEl = useRootElRef();
  const [open, setOpen] = useState(false);
  const triggerElRef = useRef<HTMLDivElement>(null);
  const [gptConfig, setGptConfig] = useState<GptOptions['config']>();
  const containerElRef = useRef<HTMLDivElement>(null);

  const setRect = (rect: DOMRect | null) => {
    const rootElRect = rootEl.current?.getBoundingClientRect();

    if (rect && triggerElRef.current && rootElRect) {
      triggerElRef.current.style.top = `${rect.top - rootElRect.top}px`;
      triggerElRef.current.style.left = `${rect.left - rootElRect.left}px`;
      triggerElRef.current.style.width = `${rect.width}px`;
      triggerElRef.current.style.height = `${rect.height}px`;
    }
  };

  useEffect(() => {
    wrapperRef.update = ({ open, rect, config }) => {
      setRect(rect);
      setOpen(open || false);
      setGptConfig(config);
    };
  }, [rootEl]);

  const curOpen = open;

  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);

      /**
       * fix: onOpenChange will be called even if the popup is closed
       */
      if (curOpen && !open) {
        editor.commands.focus();
      }
    },
    [rootEl, curOpen]
  );

  return (
    <div ref={containerElRef}>
      <ChatPanel
        open={open}
        gptConfig={gptConfig}
        getPopupContainer={() => containerElRef.current || document.body}
        onOpenChange={onOpenChange}
      >
        <div
          data-role="ai-chatpanel-trigger"
          ref={triggerElRef}
          style={{
            display: open ? 'block' : 'none',
            position: 'absolute'
          }}
        />
      </ChatPanel>
    </div>
  );
}

function dispathAICommand(editor: Editor, question: string, options?: GptOptions) {}

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

export const getPrevText = (
  editor: Editor,
  {
    chars,
    offset = 0
  }: {
    chars: number;
    offset?: number;
  }
) => {
  return editor.state.doc.textBetween(
    Math.max(0, editor.state.selection.from - chars),
    editor.state.selection.from - offset,
    '\n'
  );
};
