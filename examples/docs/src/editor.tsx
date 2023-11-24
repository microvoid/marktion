import { ReactEditor, type ReactEditorProps } from 'marktion';

const defaultEditorContent = '';

export function MarktionEditor(props: Partial<ReactEditorProps>) {
  return <ReactEditor renderer="WYSIWYG" content={defaultEditorContent} {...props} />;
}
