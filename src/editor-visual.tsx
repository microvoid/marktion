import React, { useMemo, useImperativeHandle } from 'react';
import { EditorContent, EditorOptions, useEditor, Editor } from '@tiptap/react';
import { EditorProps } from '@tiptap/pm/view';

import { Plugin, PluginType } from './plugins';
import { parse, serialize } from './plugin-markdown';
import { UploadImageHandler } from './handler';
import { EditorContext, RootElContext } from './hooks';
import { Toolbar, ToolbarProps } from './toolbar';
import { defaultTiptapExtensions } from './tiptap';
import { handleDrop } from './handlers';
import { useMarktionCtx } from './provider';

export type EditorVisualProps = React.PropsWithChildren<
  Partial<EditorOptions> & {
    markdown?: string;
    plugins?: Plugin[];

    toolbarProps?: Omit<ToolbarProps, 'editor'>;

    onUploadImage?: (file: File, editor: Editor) => Promise<string>;
  }
>;

export type EditorVisualRef = {
  getMarkdown: () => string;
  editor: Editor;
};

const defaultEditorProps: EditorProps = {
  handleDrop: handleDrop
};

export const EditorVisual = React.forwardRef<EditorVisualRef, EditorVisualProps>((props, ref) => {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const darkMode = useMarktionCtx(ctx => ctx.darkMode);
  const {
    plugins = [],
    onUploadImage,
    content: propsContent,
    markdown,
    children,
    toolbarProps,
    extensions = defaultTiptapExtensions,
    ...editorProps
  } = props;

  const content = useMemo(() => propsContent || parse(markdown || ''), [propsContent, markdown]);

  const intergrates = useMemo(() => {
    return plugins.filter(plugin => plugin.type === PluginType.intergrate);
  }, []);

  const intergrateExtensions = intergrates
    .filter(item => Boolean(item.extension))
    .map(item => item.extension!);

  const editor = useEditor({
    editorProps: defaultEditorProps,
    extensions: [...extensions, ...intergrateExtensions],
    content,
    ...editorProps
  });

  useImperativeHandle(ref, () => {
    return {
      editor: editor!,
      getMarkdown() {
        return serialize(editor?.getHTML() || '');
      }
    };
  });

  if (!editor) {
    return null;
  }

  UploadImageHandler.EDITOR_TO_HANDLER.set(editor, onUploadImage);

  return (
    <EditorContext.Provider value={editor}>
      <RootElContext.Provider value={rootElRef}>
        <div className="marktion" ref={rootElRef}>
          <Toolbar editor={editor} {...toolbarProps} />

          <EditorContent
            className="marktion-editor"
            data-mode={darkMode ? 'dark' : null}
            editor={editor}
          />

          {intergrates.map(item => (
            <React.Fragment key={item.id}>
              {item.view &&
                item.view({
                  editor: editor
                })}
            </React.Fragment>
          ))}

          {children}
        </div>
      </RootElContext.Provider>
    </EditorContext.Provider>
  );
});
