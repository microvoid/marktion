import { Extension } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { createIntergrateExtension } from '../plugins';
import { gpt } from './api';

export const AIPlugin = createIntergrateExtension(() => {
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

      const text = getPrevText(this.editor, { chars: 2 });
      const isAIActive = text === '++' || '??';

      if (isAIActive) {
        const question = getPrevText(this.editor, {
          chars: 5000
        });

        gpt(question).then(console.log);
      }
    }
  });

  function Wrapper() {
    return null;
  }

  return {
    view: ctx => {
      return <Wrapper />;
    },
    extension: AIExtensions
  };
});

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
