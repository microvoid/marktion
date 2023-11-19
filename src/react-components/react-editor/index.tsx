import React, { useEffect, useMemo, useRef } from 'react';
import { Marktion, MarktionOptions } from '../../marktion';
import { MarktionContext } from '../../react-hooks';
import { useBubble } from '../bubble';
import { useSlash } from '../slash';
import { event } from '../../plugin-event';

export type ReactEditorProps = React.PropsWithChildren<MarktionOptions>;

export function ReactEditor(props: ReactEditorProps) {
  const { children, ...options } = props;
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
    <div className="marktion-themes marktion-theme" data-accent-color="tomato" ref={rootRef}>
      <MarktionContext.Provider value={editor}>
        {bubble.element}
        {slash.element}

        {children}
      </MarktionContext.Provider>
    </div>
  );
}
