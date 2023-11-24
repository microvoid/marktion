import { ReactEditor, type ReactEditorProps, useAI } from 'marktion';

const defaultEditorContent = '';

export function MarktionEditor(props: Partial<ReactEditorProps>) {
  const ai = useAI();

  return (
    <ReactEditor renderer="WYSIWYG" content={defaultEditorContent} plugins={[ai.plugin]} {...props}>
      {ai.element}
    </ReactEditor>
  );
}
