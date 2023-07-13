import { Extension } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { createIntergrateExtension } from '../plugins';
import { limitGpt } from './api';

export const AIPlugin = createIntergrateExtension(() => {
  const isAIContinueWriting = segments('+', 2);

  const AIExtensions = Extension.create({
    name: 'ai',

    addOptions() {
      return {
        ai: {
          apiKey: import.meta.env.VITE_OPENAI_PROXY_URL,
          apiBaseUrl: import.meta.env.VITE_OPENAI_TOKEN,
          model: 'gpt-3.5-turbo'
        }
      };
    },

    onTransaction({ transaction }) {
      if (!transaction.docChanged) {
        return;
      }

      const editor = this.editor;
      const text = getPrevText(editor, { chars: 1 });

      if (isAIContinueWriting(text)) {
        console.log('ai');
      }

      // const isAIActive = text === '++' || text === '??';

      // if (isAIActive) {
      // limitGpt(question, {
      //   onProgress(event) {
      //     const delta = event.choices[0].delta.content || '';
      //     editor.commands.insertContent(delta);
      //   }
      // }).then(console.log);
      // }
    }
  });

  function Wrapper() {
    return null;
  }

  return {
    view: () => {
      return <Wrapper />;
    },
    extension: AIExtensions
  };
});

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

    if (s.length < count) {
      s += input;

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
