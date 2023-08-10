import { EditorBubbleMenuPlugin, SlashMenuPlugin, AIPlugin } from 'marktion';

export function getPlugins() {
  return [
    EditorBubbleMenuPlugin(),
    SlashMenuPlugin(),
    AIPlugin({
      openai: {
        basePath: '/api'
      }
    })
  ];
}
