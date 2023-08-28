import { Button, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { PencilIcon, CodeIcon } from 'lucide-react';
import { Marktion, MarktionProps, MarktionRef } from '.';
import { MarktionSource, MarktionSourceProps } from './source';

export type MarktionCombiProps = React.PropsWithChildren<{
  value: string;
  mode?: 'visual' | 'source';
  marktionProps?: MarktionProps & {
    ref?: React.RefObject<MarktionRef>;
  };
  sourceProps?: MarktionSourceProps;
}>;

export function MarktionCombi(props: MarktionCombiProps) {
  const {
    mode: propsMode = 'visial',
    value: propsValue,
    marktionProps,
    sourceProps,
    children
  } = props;

  const _ref = useRef<MarktionRef>(null);
  const [mode, setMode] = useState(propsMode);
  const [markdown, setMarkdown] = useState(propsValue);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const marktionRef = marktionProps?.ref || _ref;
  const isSourceMode = mode === 'source';

  useEffect(() => {
    if (propsValue !== markdown) {
      setMarkdown(propsValue);
    }
  }, [propsValue]);

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
    setTooltipOpen(false);

    if (mode === 'visual') {
      marktionRef.current?.editor.commands.setMarkdwon(markdown);
    } else {
      setMarkdown(marktionRef.current?.getMarkdown() || '');
    }
  };

  const toolbarRight = (
    <div>
      <Tooltip
        open={tooltipOpen}
        onOpenChange={setTooltipOpen}
        title={isSourceMode ? 'Visual Mode(cmd+/)' : 'Source Mode(cmd+/)'}
      >
        <Button
          type="text"
          onClick={onChangeMode}
          icon={isSourceMode ? <PencilIcon /> : <CodeIcon />}
        />
      </Tooltip>
      {props.marktionProps?.toolbarProps?.addonRight}
    </div>
  );

  return (
    <div className={cls('marktion-combi')} data-mode={mode}>
      <Marktion
        {...marktionProps}
        ref={marktionRef}
        markdown={markdown}
        toolbarProps={{
          ...marktionProps?.toolbarProps,
          addonRight: toolbarRight
        }}
      >
        {children}
      </Marktion>

      {mode === 'source' && (
        <MarktionSource
          value={markdown}
          toolbarProps={{
            addonRight: toolbarRight
          }}
          onChange={setMarkdown}
          theme={marktionProps?.darkMode ? 'vs-dark' : 'vs-light'}
          {...sourceProps}
        />
      )}
    </div>
  );
}
