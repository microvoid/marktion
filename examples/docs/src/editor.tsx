import { ReactEditor, type ReactEditorProps, useAI } from 'marktion';

const defaultEditorContent = '';

export function MarktionEditor(props: Partial<ReactEditorProps>) {
  const ai = useAI({
    basePath: import.meta.env.VITE_OPENAI_BASE_URL
  });

  return (
    <ReactEditor
      className="marktion-editor"
      renderer="WYSIWYG"
      content={defaultEditorContent}
      plugins={[ai.plugin]}
      {...props}
    >
      {ai.element}
    </ReactEditor>
  );
}
