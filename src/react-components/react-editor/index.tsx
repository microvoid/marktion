import cls from 'classnames';
import { ConfigProvider, theme } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { Marktion, MarktionOptions } from '../../marktion';
import { MarktionContext } from '../../react-hooks';
import { event } from '../../plugin-event';
import { useBubble } from '../bubble';
import { useSlash } from '../slash';

export type ReactEditorProps = React.PropsWithChildren<
  MarktionOptions & {
    className?: string;
    dark?: boolean;
  }
>;

export function ReactEditor(props: ReactEditorProps) {
  const { children, dark, className, ...options } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const bubble = useBubble();
  const slash = useSlash();

  const editor = useMemo(() => {
    const internalPlugins = [bubble.plugin, slash.plugin, event()];

    return new Marktion({
      content: options.content,
      plugins: internalPlugins.concat(options.plugins || []),
      renderer: options.renderer
    });
  }, []);

  useEffect(() => {
    if (rootRef.current && !editor.rootEl) {
      editor.mount(rootRef.current);
    }
  }, []);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        editor.setRenderer(editor.renderer === 'SOURCE' ? 'WYSIWYG' : 'SOURCE');
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);

  return (
    <div
      className={cls('marktion-themes', className, {
        dark
      })}
      data-accent-color="violet"
      ref={rootRef}
    >
      <ConfigProvider
        getPopupContainer={() => rootRef.current || document.body}
        theme={{
          token: {
            colorPrimary: '#654dc4'
          },
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
      >
        <MarktionContext.Provider value={editor}>
          {bubble.element}
          {slash.element}

          {children}
        </MarktionContext.Provider>
      </ConfigProvider>
    </div>
  );
}
