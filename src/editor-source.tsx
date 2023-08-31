import { MarktionSourceToolbar, MarktionSourceToolbarProps } from './toolbar';
import { MonacoEditor, MonacoEditorProps } from './monaco';
import { useMarktionCtx } from './provider';

export type EditorSourceProps = MonacoEditorProps & {
  toolbarProps?: MarktionSourceToolbarProps;
};

export function EditorSource({ toolbarProps, ...monacoProps }: EditorSourceProps) {
  const darkMode = useMarktionCtx(ctx => ctx.darkMode);

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
        theme={darkMode ? 'vs-dark' : 'vs-light'}
        {...monacoProps}
      />
    </div>
  );
}
