import React, { useEffect, useRef, useState } from 'react';
import { Marktion } from '../../marktion';
import { MarktionContext } from '../../react-hooks';
import { SlashPlugin } from '../slash';

export type ReactEditorProps = React.PropsWithChildren<{
  editor: Marktion;
}>;

export function ReactEditor(props: ReactEditorProps) {
  const { editor, children } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const [_, setMounted] = useState(false);

  useEffect(() => {
    if (rootRef.current) {
      editor.mount(rootRef.current);
      setMounted(true);
    }
  }, [props.editor]);

  return (
    <div className="marktion-themes marktion-theme" data-accent-color="tomato" ref={rootRef}>
      <MarktionContext.Provider value={editor}>
        <SlashPlugin />
        {children}
      </MarktionContext.Provider>
    </div>
  );
}
