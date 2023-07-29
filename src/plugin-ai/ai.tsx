import { Extension } from '@tiptap/react';
import { Editor, posToDOMRect } from '@tiptap/core';
import { DEFAULT_CONTINUE_WRITING } from './constants';
import { createIntergrateExtension } from '../plugins';
import { GptOptions, limitGpt } from './api';
import { AIOptions, AIStorage } from './interface';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatPanel } from './ui-chat-panel';
import { useEditor, useRootElRef } from '../hooks';

export const AIPlugin = createIntergrateExtension((options: AIOptions) => {
  const isAIContinueWriting = segments('+', 2);
  const isAIAsking = segments('?', 2);

  const AIExtensions = Extension.create<AIOptions, AIStorage>({
    name: 'ai',

    addOptions() {
      return {
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
        AIAsking: (editor: Editor) => {
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
      if (!transaction.docChanged) {
        return;
      }

      const editor = this.editor;
      const storage = editor.storage.ai as AIStorage;
      const text = getPrevText(editor, { chars: 2 });

      if (isAIContinueWriting(text[1]) && text === '++') {
        const question = getPrevText(editor, {
          chars: 5000
        });
        storage.AIContinueWriting(editor, question);
      } else if (isAIAsking(text[1]) && text === '??') {
        const question = getPrevText(editor, {
          chars: 5000
        });
        storage.AIAsking(editor, question);
      }
    }
  });

  const wrapperElRef: {
    update: (options: {
      open?: boolean;
      rect: DOMRect | null;
      config: GptOptions['config'];
    }) => void;
  } = {
    update: () => {}
  };

  function ViewWrapper() {
    const rootEl = useRootElRef();
    const [open, setOpen] = useState(false);
    const editor = useEditor();
    const triggerElRef = useRef<HTMLDivElement>(null);
    const [gptConfig, setGptConfig] = useState<GptOptions['config']>();

    const setRect = (rect: DOMRect | null) => {
      const rootElRect = rootEl.current!.getBoundingClientRect();

      if (rect && triggerElRef.current) {
        triggerElRef.current.style.top = `${rect.top - rootElRect.top}px`;
        triggerElRef.current.style.left = `${rect.left - rootElRect.left}px`;
        triggerElRef.current.style.width = `${rect.width}px`;
        triggerElRef.current.style.height = `${rect.height}px`;
      }
    };

    useEffect(() => {
      wrapperElRef.update = ({ open, rect, config }) => {
        setRect(rect);
        setOpen(open || false);
        setGptConfig(config);
      };
    }, [rootEl]);

    const onOpenChange = useCallback((open: boolean) => {
      setOpen(open);

      if (!open) {
        editor.commands.focus();
      }
    }, []);

    return (
      <ChatPanel open={open} onOpenChange={onOpenChange} gptConfig={gptConfig}>
        <div
          data-role="ai-chatpanel-trigger"
          ref={triggerElRef}
          style={{
            display: open ? 'block' : 'none',
            position: 'absolute'
          }}
        ></div>
      </ChatPanel>
    );
  }

  return {
    extension: AIExtensions,
    view() {
      return <ViewWrapper />;
    }
  };
});

function dispathAICommand(editor: Editor, question: string, options?: GptOptions) {
  editor.commands.deleteRange({
    from: editor.state.selection.from - 2,
    to: editor.state.selection.from
  });

  limitGpt(question, {
    ...options,
    onProgress(event) {
      const delta = event.choices[0].delta.content || '';
      editor.commands.insertContent(delta);
    }
  }).then(res => {
    const content = res.choices[0].delta.content || '';

    editor.commands.setTextSelection({
      from: editor.state.selection.from - content.length,
      to: editor.state.selection.from
    });
  });
}

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
