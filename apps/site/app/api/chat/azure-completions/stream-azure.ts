import {
  OpenAIClient,
  AzureKeyCredential,
  ChatRequestMessage,
  GetChatCompletionsOptions
} from '@azure/openai';
import { OpenAIStream } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
);

export async function createAzureAIStream(
  messages: ChatRequestMessage[],
  options?: GetChatCompletionsOptions
) {
  // Ask Azure OpenAI for a streaming chat completion given the prompt
  const response = await client.streamChatCompletions(
    process.env.AZURE_OPENAI_DEPLOYED_NAME!,
    messages,
    options
  );

  const stream = OpenAIStream(response as unknown as Response);

  return stream;
}
