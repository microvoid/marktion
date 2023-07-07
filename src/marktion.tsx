import React, { useMemo } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { EditorContent, EditorOptions, useEditor } from '@tiptap/react';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import TaskItemExtension from '@tiptap/extension-task-item';
import TaskListExtension from '@tiptap/extension-task-list';

import { PluginCreator, PluginType } from './plugins';
import { EditorBubbleMenuPlugin } from './plugins/bubble-menu';
import { SlashMenuPlugin } from './plugins/slash-menu';
import { RootElContext } from './hooks';

import './marktion.css';

type MarktionEditorProps = Partial<EditorOptions> & {
  darkMode?: boolean;
  plugins?: PluginCreator[];
};

export function MarktionEditor(props: MarktionEditorProps) {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const { darkMode = false, plugins = [EditorBubbleMenuPlugin, SlashMenuPlugin] } = props;

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
      TaskItemExtension,
      TaskListExtension,
      ...intergratePlugins
    ],
    content: `<p>
  Markdown shortcuts make it easy to format the text while typing.
</p>
<p>
  To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
</p>
<p>
  Those conventions are called input rules in tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
</p>
<p>
  You can overwrite existing input rules or add your own to nodes, marks and extensions.
</p>
<p>
  For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
</p>`
  });

  if (!editor) {
    return null;
  }

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
