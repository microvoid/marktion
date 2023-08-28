import MonacoEditor, { MonacoEditorProps } from 'react-monaco-editor';
import { MarktionSourceToolbar, MarktionSourceToolbarProps } from './toolbar';

export type MarktionSourceProps = MonacoEditorProps & {
  toolbarProps?: MarktionSourceToolbarProps;
};

export function MarktionSource({ toolbarProps, ...monacoProps }: MarktionSourceProps) {
  return (
    <div className="marktion-source">
      <MarktionSourceToolbar {...toolbarProps} />

      <MonacoEditor
        height="800"
        language="markdown"
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: false
        }}
        {...monacoProps}
      />
    </div>
  );
}
