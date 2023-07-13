import { Extension } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { DEFAULT_CONTINUE_WRITING, DEFAULT_GPT_PROMPT } from './constants';
import { createIntergrateExtension } from '../plugins';
import { GptOptions, limitGpt } from './api';
import { AIOptions, AIStorage } from './interface';

export const AIPlugin = createIntergrateExtension(() => {
  const isAIContinueWriting = segments('+', 2);
  const isAIAsking = segments('?', 2);

  const AIExtensions = Extension.create<AIOptions, AIStorage>({
    name: 'ai',

    addOptions() {
      return {
        openai: {
          apiKey: import.meta.env.VITE_OPENAI_TOKEN,
          basePath: import.meta.env.VITE_OPENAI_PROXY_URL
        }
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

  return {
    extension: AIExtensions
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
