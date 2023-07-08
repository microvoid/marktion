import { Editor } from '@tiptap/react';

type onUploadImage = (file: File, editor: Editor) => Promise<string>;

export const UploadImageHandler = {
  EDITOR_TO_HANDLER: new WeakMap<Editor, onUploadImage | undefined>(),

  impl(editor: Editor, handler?: onUploadImage) {
    UploadImageHandler.EDITOR_TO_HANDLER.set(editor, handler);
  },

  get(editor: Editor) {
    return UploadImageHandler.EDITOR_TO_HANDLER.get(editor);
  }
};
