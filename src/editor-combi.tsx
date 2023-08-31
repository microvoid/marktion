import { Segmented, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { EditorSource, EditorSourceProps } from './editor-source';
import { EditorVisual, EditorVisualProps, EditorVisualRef } from './editor-visual';
import { useMarktionCtx } from './provider';

export type EditorCombiProps = React.PropsWithChildren<{
  mode?: 'visual' | 'source';
  visualProps?: EditorVisualProps & {
    ref?: React.RefObject<EditorVisualRef>;
  };
  sourceProps?: EditorSourceProps;
}>;

export function EditorCombi(props: EditorCombiProps) {
  const { mode: propsMode = 'visual', visualProps, sourceProps, children } = props;

  const _ref = useRef<EditorVisualRef>(null);
  const [mode, setMode] = useState(propsMode);
  const markdown = useMarktionCtx(ctx => ctx.markdown);
  const setMarkdown = useMarktionCtx(ctx => ctx.setMarkdown);

  const visualEditorRef = visualProps?.ref || _ref;
  const isSourceMode = mode === 'source';

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        setMode(mode => (mode === 'source' ? 'visual' : 'source'));
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  const onChangeMode = () => {
    const mode = isSourceMode ? 'visual' : 'source';

    setMode(mode);

    if (mode === 'visual') {
      visualEditorRef.current?.editor.commands.setMarkdwon(markdown);
    } else {
      setMarkdown(visualEditorRef.current?.getMarkdown() || '');
    }
  };

  const toolbarRight = (
    <div>
      <Tooltip title={'Change editor mode(ctrl+/)'}>
        <Segmented
          size="small"
          options={[
            {
              label: 'Visual',
              value: 'visual'
            },
            {
              label: 'Source',
              value: 'source'
            }
          ]}
          onChange={onChangeMode}
          value={mode}
        />
      </Tooltip>
      {props.visualProps?.toolbarProps?.addonRight}
    </div>
  );

  return (
    <div className={cls('marktion-combi')} data-mode={mode}>
      <EditorVisual
        {...visualProps}
        ref={visualEditorRef}
        markdown={markdown}
        toolbarProps={{
          ...visualProps?.toolbarProps,
          addonRight: toolbarRight
        }}
      >
        {children}
      </EditorVisual>

      {mode === 'source' && (
        <EditorSource
          value={markdown}
          toolbarProps={{
            addonRight: toolbarRight
          }}
          onChange={setMarkdown}
          {...sourceProps}
        />
      )}
    </div>
  );
}
