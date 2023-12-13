import { Configuration } from 'openai-edge';

export function getOpenAIConfig() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_BASE_URL
  });

  return config;
}
