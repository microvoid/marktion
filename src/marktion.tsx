import React, { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { EditorContent, EditorOptions, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';

import { EditorBubbleMenuPlugin } from './plugins/bubble-menu';
import { SlashMenuPlugin } from './plugins/slash-menu';
import { PluginCreator, PluginType } from './plugins';
import { UploadImageHandler } from './handler';
import { RootElContext } from './hooks';

import './marktion.css';

export type MarktionEditorProps = Partial<EditorOptions> & {
  darkMode?: boolean;
  plugins?: PluginCreator[];

  onUploadImage?: (file: File, editor: Editor) => Promise<string>;
};

export function MarktionEditor(props: MarktionEditorProps) {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const {
    darkMode = false,
    plugins = [EditorBubbleMenuPlugin, SlashMenuPlugin],
    onUploadImage,
    ...editorProps
  } = props;

  const intergrates = useMemo(() => {
    return plugins
      .filter(plugin => plugin.type === PluginType.intergrate)
      .map(plugin => ({
        plugin: plugin.install(),
        id: plugin.id
      }));
  }, []);

  const intergratePlugins = intergrates
    .filter(item => Boolean(item.plugin.extension))
    .map(item => item.plugin.extension!);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      TaskItem,
      TaskList,
      Image,
      ...intergratePlugins
    ],
    ...editorProps
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
            <EditorContent className="marktion-editor" editor={editor} />
            {intergrates.map(item => (
              <React.Fragment key={item.id}>
                {item.plugin.view({
                  editor: editor
                })}
              </React.Fragment>
            ))}
          </div>
        </RootElContext.Provider>
      </StyleProvider>
    </ConfigProvider>
  );
}

export default MarktionEditor;
