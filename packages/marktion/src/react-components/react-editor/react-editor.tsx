import cls from 'classnames';
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Marktion, MarktionOptions } from '../../marktion';

import { event } from '../../plugin-event';
import { useBubble, useLinkBubble } from '../bubble';
import { useSlash } from '../slash';
import { ReactEditorProvider } from './provider';

export type ReactEditorProps = React.PropsWithChildren<
  Partial<MarktionOptions> & {
    className?: string;
    dark?: boolean;
  }
>;

export type ReactEditorRef = {
  editor: Marktion;
};

export const ReactEditor = React.forwardRef<ReactEditorRef, ReactEditorProps>((props, ref) => {
  const { children, dark = false, className, ...options } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const slash = useSlash();
  const bubble = useBubble();
  const linkBubble = useLinkBubble();

  const editor = useMemo(() => {
    const internalPlugins = [bubble.plugin, linkBubble.plugin, slash.plugin, event()];

    return new Marktion({
      ...options,
      content: options.content || '',
      renderer: options.renderer || 'WYSIWYG',
      plugins: internalPlugins.concat(options.plugins || [])
    });
  }, []);

  useImperativeHandle(ref, () => {
    return {
      editor
    };
  });

  useEffect(() => {
    editor.options.onChange = props.onChange;
  }, [editor, props.onChange]);

  useEffect(() => {
    editor.setTheme(dark ? 'dark' : 'light');
  }, [editor, dark]);

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
      <ReactEditorProvider editor={editor} dark={dark}>
        {linkBubble.element}
        {bubble.element}
        {slash.element}

        {children}
      </ReactEditorProvider>
    </div>
  );
});
