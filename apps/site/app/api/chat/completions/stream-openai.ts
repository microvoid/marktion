import { CreateChatCompletionRequest, OpenAIApi } from 'openai-edge';
import { OpenAIStream } from 'ai';
import { getOpenAIConfig } from './config';

const openai = new OpenAIApi(getOpenAIConfig()!);

export async function createOpenAIStream(options: CreateChatCompletionRequest) {
  const response = await openai.createChatCompletion({
    ...options
  });

  const stream = OpenAIStream(response);

  return stream;
}
