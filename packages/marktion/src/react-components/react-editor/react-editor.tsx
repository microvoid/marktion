import cls from 'classnames';
import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Marktion, MarktionOptions } from '../../marktion';

import { event } from '../../plugin-event';
import { useBubble, useLinkBubble } from '../bubble';
import { useSlash } from '../slash';
import { ReactEditorProvider } from './provider';
import { CodeblockNodeView } from '../../plugin-codemirror';
import { useCodemirror } from '../codemirror/codemirror';

export type ReactEditorProps = React.PropsWithChildren<
  Partial<MarktionOptions> & {
    prefix?: React.ReactNode;
    className?: string;
    bordered?: boolean;
    dark?: boolean;
    style?: React.CSSProperties;
  }
>;

export type ReactEditorRef = {
  editor: Marktion;
};

export const ReactEditor = React.forwardRef<ReactEditorRef, ReactEditorProps>((props, ref) => {
  const { children, dark = false, bordered = true, className, prefix, style, ...options } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const slash = useSlash();
  const bubble = useBubble();
  const linkBubble = useLinkBubble();
  const codemirror = useCodemirror();

  const editor = useMemo(() => {
    const internalPlugins = [
      bubble.plugin,
      linkBubble.plugin,
      slash.plugin,
      codemirror.plugin,
      event()
    ];

    return new Marktion({
      ...options,
      content: options.content || '',
      renderer: options.renderer || 'WYSIWYG',
      plugins: internalPlugins.concat(options.plugins || []),
      nodeViews: {
        code_block: CodeblockNodeView
      }
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
      if (e.ctrlKey && e.key === '/' && editor.hasFocus()) {
        editor.setRenderer(editor.renderer === 'SOURCE' ? 'WYSIWYG' : 'SOURCE');
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [editor]);

  return (
    <div
      className={cls('marktion-themes', className, {
        'marktion-themes-bordered': bordered,
        dark
      })}
      data-accent-color="violet"
      ref={rootRef}
      style={style}
    >
      <ReactEditorProvider editor={editor} dark={dark}>
        {prefix}

        {linkBubble.element}
        {bubble.element}
        {slash.element}
        {codemirror.element}

        {children}
      </ReactEditorProvider>
    </div>
  );
});
