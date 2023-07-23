import React, { useMemo, useImperativeHandle } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { EditorContent, EditorOptions, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import TiptapImage from '@tiptap/extension-image';
import TiptapTaskItem from '@tiptap/extension-task-item';
import TiptapTaskList from '@tiptap/extension-task-list';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
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

const TaskList = TiptapTaskList.extend({
  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 51
      },
      {
        tag: 'ul.contains-task-list',
        priority: 51
      }
    ];
  }
});

const TaskItem = TiptapTaskItem.extend({
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: element =>
          element.querySelector('input[type="checkbox"]')?.hasAttribute('checked'),
        renderHTML: attributes => ({
          'data-checked': attributes.checked
        })
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51
      },
      {
        tag: `li.task-list-item`,
        priority: 51
      }
    ];
  }
});

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

const Image = TiptapImage.configure({
  allowBase64: true
});

export const defaultTiptapExtensions = [
  MarkdownExtension,
  StarterKit,
  Highlight,
  Typography,
  TaskList.configure({
    HTMLAttributes: {
      class: 'contains-task-list not-prose'
    }
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: 'task-list-item'
    },
    nested: true
  }),
  Image,
  Link,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  FenseExtension
];

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
