import React, { useMemo, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { EditorContent, EditorOptions, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import { Plugin, PluginType } from './plugins';
import { MarkdownExtension, parse, serialize } from './plugin-markdown';
import { UploadImageHandler } from './handler';
import { FenseExtension } from './plugin-fense';
import { RootElContext } from './hooks';
import { Toolbar, ToolbarProps } from './toolbar';

import './marktion.css';

export type MarktionProps = React.PropsWithChildren<
  Partial<EditorOptions> & {
    markdown?: string;
    darkMode?: boolean;
    plugins?: Plugin[];

    toolbarProps?: ToolbarProps;

    onUploadImage?: (file: File, editor: Editor) => Promise<string>;
  }
>;

export type MarktionRef = {
  getMarkdown: () => string;
  editor: Editor;
};

const Image = TiptapImage.configure({
  allowBase64: true
});

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
    ...editorProps
  } = props;

  const content = useMemo(() => propsContent || parse(markdown || ''), [propsContent, markdown]);

  const intergrates = useMemo(() => {
    return plugins.filter(plugin => plugin.type === PluginType.intergrate);
  }, []);

  const intergratePlugins = intergrates
    .filter(item => Boolean(item.extension))
    .map(item => item.extension!);

  const editor = useEditor({
    extensions: [
      MarkdownExtension,
      StarterKit,
      Highlight,
      Typography,
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2'
        }
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-4'
        },
        nested: true
      }),
      Image,
      Link,
      Table,
      TableHeader,
      TableRow,
      TableCell,
      FenseExtension,
      ...intergratePlugins
    ],
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
        <RootElContext.Provider value={rootElRef.current}>
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
      </StyleProvider>
    </ConfigProvider>
  );
});

export default Marktion;
