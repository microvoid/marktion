import React, { useEffect, useMemo, useRef } from 'react';
import { Marktion, MarktionOptions } from '../../marktion';
import { MarktionContext } from '../../react-hooks';
import { useBubble } from '../bubble';
import { useSlash } from '../slash';

export type ReactEditorProps = React.PropsWithChildren<MarktionOptions>;

export function ReactEditor(props: ReactEditorProps) {
  const { children, ...options } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const bubble = useBubble();
  const slash = useSlash();

  const editor = useMemo(() => {
    const internalPlugins = [bubble.plugin, slash.plugin];

    return new Marktion({
      content: options.content,
      plugins: internalPlugins.concat(options.plugins || []),
      renderer: options.renderer
    });
  }, []);

  useEffect(() => {
    if (rootRef.current) {
      editor.mount(rootRef.current);
    }
  }, []);

  return (
    <div className="marktion-themes marktion-theme" data-accent-color="tomato" ref={rootRef}>
      <MarktionContext.Provider value={editor}>
        {/* <SlashPlugin /> */}
        {bubble.element}
        {slash.element}

        {children}
      </MarktionContext.Provider>
    </div>
  );
}
