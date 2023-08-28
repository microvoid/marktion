import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { PencilIcon, CodeIcon } from 'lucide-react';
import { Marktion, MarktionProps, MarktionRef } from '.';
import { MarktionSource } from './source';

export type MarktionCombiProps = React.PropsWithChildren<{
  value: string;
  mode?: 'visual' | 'source';
  marktionProps?: MarktionProps & {
    ref?: React.RefObject<MarktionRef>;
  };
}>;

export function MarktionCombi(props: MarktionCombiProps) {
  const { mode: propsMode = 'source', marktionProps, value: propsValue } = props;

  const _ref = useRef<MarktionRef>(null);
  const [mode, setMode] = useState(propsMode);
  const [markdown, setMarkdown] = useState(propsValue);

  const marktionRef = marktionProps?.ref || _ref;
  const isSourceMode = mode === 'source';

  useEffect(() => {
    if (propsValue !== markdown) {
      setMarkdown(propsValue);
    }
  }, [propsValue]);

  const onChangeMode = () => {
    const mode = isSourceMode ? 'visual' : 'source';

    setMode(mode);

    if (mode === 'visual') {
      marktionRef.current?.editor.commands.setMarkdwon(markdown);
    } else {
      setMarkdown(marktionRef.current?.getMarkdown() || '');
    }
  };

  const toolbarRight = (
    <div>
      <Button
        title={isSourceMode ? 'Change to Visual mode' : 'Change to Source mode'}
        type="text"
        onClick={onChangeMode}
        icon={isSourceMode ? <PencilIcon /> : <CodeIcon />}
      />
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
      />

      {mode === 'source' && (
        <MarktionSource
          value={markdown}
          toolbarProps={{
            addonRight: toolbarRight
          }}
          onChange={setMarkdown}
          theme={marktionProps?.darkMode ? 'vs-dark' : 'vs-light'}
        />
      )}
    </div>
  );
}
