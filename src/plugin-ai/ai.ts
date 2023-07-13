import { Extension } from '@tiptap/react';
import { Editor } from '@tiptap/core';
import { createIntergrateExtension } from '../plugins';

export const AIPlugin = createIntergrateExtension(() => {
  const AIExtensions = Extension.create({
    name: 'ai',

    onTransaction({ transaction }) {
      if (!transaction.docChanged) {
        return;
      }

      const text = getPrevText(this.editor, { chars: 2 });
      const isAIActive = text === '++' || '??';

      if (isAIActive) {
      }
    }
  });

  return {
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
