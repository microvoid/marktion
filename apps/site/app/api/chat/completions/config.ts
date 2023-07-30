import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai-edge';

const AZURE_OPENAI_API_INSTANCE_NAME = process.env.AZURE_OPENAI_API_INSTANCE_NAME;
const AZURE_OPENAI_API_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME;
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION;

const endpoint = `https://${AZURE_OPENAI_API_INSTANCE_NAME}.openai.azure.com`;

export function getConfig() {
  return getOpenAIConfig() || getAzureConfig();
}

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

export function getAzureConfig() {
  if (!AZURE_OPENAI_API_VERSION || !AZURE_OPENAI_API_DEPLOYMENT_NAME) {
    return null;
  }

  const config = new Configuration({
    basePath: `${endpoint}/openai/deployments/${AZURE_OPENAI_API_DEPLOYMENT_NAME}`,
    defaultQueryParams: new URLSearchParams({
      'api-version': AZURE_OPENAI_API_VERSION
    }),
    baseOptions: {
      headers: {
        'api-key': AZURE_OPENAI_API_KEY
      }
    }
  });

  return config;
}
