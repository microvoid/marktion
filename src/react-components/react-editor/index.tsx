import React, { useEffect, useRef, useState } from 'react';
import { Marktion } from '../../marktion';
import { MarktionContext } from '../../react-hooks';

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

  const contextChildren = editor.rootEl ? (
    <MarktionContext.Provider value={editor}>{children}</MarktionContext.Provider>
  ) : null;

  return (
    <div className="marktion-themes" data-accent-color="tomato" ref={rootRef}>
      {contextChildren}
    </div>
  );
}
