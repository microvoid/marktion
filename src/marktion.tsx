import { EditorContent, EditorOptions, useEditor } from '@tiptap/react';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

import './marktion.css';
import { PluginCreator, PluginType } from './plugins';
import React, { useMemo } from 'react';
import { EditorBubbleMenuPlugin } from './plugins/bubble-menu';
import { SlashCommand } from './plugins/slash-menu';

type MarktionEditorProps = Partial<EditorOptions> & {
  darkMode?: boolean;
  plugins?: PluginCreator[];
};

export function MarktionEditor(props: MarktionEditorProps) {
  const { darkMode = false, plugins = [EditorBubbleMenuPlugin] } = props;

  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, SlashCommand],
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

  const intergrates = useMemo(() => {
    if (!editor) {
      return [];
    }

    return plugins
      .filter(plugin => plugin.type === PluginType.intergrate)
      .map(plugin => ({
        plugin: plugin.install({
          editor: editor
        }),
        id: plugin.id
      }));
  }, [plugins, editor]);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <StyleProvider hashPriority="high">
        <EditorContent className="marktion" editor={editor} />
        {intergrates.map(item => (
          <React.Fragment key={item.id}>{item.plugin.view()}</React.Fragment>
        ))}
      </StyleProvider>
    </ConfigProvider>
  );
}

export default MarktionEditor;
