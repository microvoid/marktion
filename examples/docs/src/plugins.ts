import { EditorBubbleMenuPlugin, SlashMenuPlugin, AIPlugin } from '../../..';

export const getPlugins = () => {
  return [
    EditorBubbleMenuPlugin(),
    SlashMenuPlugin(),
    AIPlugin({
      openai: {
        basePath: import.meta.env.VITE_OPENAI_PROXY_URL,
        apiKey: import.meta.env.VITE_OPENAI_TOKEN
      }
    })
  ];
};
