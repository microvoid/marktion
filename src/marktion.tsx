import React, { useMemo, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { EditorContent, EditorOptions, useEditor, Editor } from '@tiptap/react';

import { Plugin, PluginType } from './plugins';
import { parse, serialize } from './plugin-markdown';
import { UploadImageHandler } from './handler';
import { EditorContext, RootElContext } from './hooks';
import { Toolbar, ToolbarProps } from './toolbar';
import { defaultTiptapExtensions } from './tiptap';
import { handleDrop } from './handlers';
import { EditorProps } from '@tiptap/pm/view';

export type MarktionProps = React.PropsWithChildren<
  Partial<EditorOptions> & {
    markdown?: string;
    darkMode?: boolean;
    plugins?: Plugin[];

    toolbarProps?: Omit<ToolbarProps, 'editor'>;

    onUploadImage?: (file: File, editor: Editor) => Promise<string>;
  }
>;

export type MarktionRef = {
  getMarkdown: () => string;
  editor: Editor;
};

const defaultEditorProps: EditorProps = {
  handleDrop: handleDrop
};

export const Marktion = React.forwardRef<MarktionRef, MarktionProps>((props, ref) => {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const {
    darkMode = false,
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
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <StyleProvider hashPriority="high">
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
      </StyleProvider>
    </ConfigProvider>
  );
});

export default Marktion;
