import { createParser } from 'eventsource-parser';
import { Configuration, OpenAIApi, ConfigurationParameters } from 'openai-edge';
import pLimit from 'p-limit';

const limit = pLimit(1);

export const limitGpt = (...args: Parameters<typeof gpt>) => limit(() => gpt(...args));

async function gpt(
  content: string,
  options?: {
    systemMessage?: string;
    config?: ConfigurationParameters;
    onProgress?: (event: CreateChatCompletionDeltaResponse) => void;
  }
) {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: import.meta.env.VITE_OPENAI_TOKEN,
      basePath: import.meta.env.VITE_OPENAI_PROXY_URL,
      ...options?.config
    })
  );

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an AI writing assistant that continues existing text based on context from prior text. ' +
          'Give more weight/priority to the later characters than the beginning ones. ' +
          'Limit your response to no more than 200 characters, but make sure to construct complete sentences.'
      },
      {
        role: 'user',
        content
      }
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1
  });

  return new Promise<CreateChatCompletionDeltaResponse>((resolve, reject) => {
    let result: CreateChatCompletionDeltaResponse;

    handleStream(response, {
      onError: reject,
      onProgress: message => {
        if (message === '[DONE]') {
          return resolve(result);
        }

        const event = JSON.parse(message) as CreateChatCompletionDeltaResponse;

        options?.onProgress?.(event);

        if (!result) {
          result = event;
        } else {
          const delta = event.choices[0].delta?.content;

          if (delta) {
            result.choices[0].delta.content += delta;
          }
        }
      }
    });
  });
}

export type Role = 'user' | 'assistant' | 'system';

export interface CreateChatCompletionDeltaResponse {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: [
    {
      delta: {
        role: Role;
        content?: string;
      };
      index: number;
      finish_reason: string | null;
    }
  ];
}

type HandleStreamOptions = {
  onProgress?: (message: string) => void;
  onError?: (err: Error) => void;
};

async function handleStream(response: Response, options?: HandleStreamOptions) {
  const { onProgress, onError } = options || {};

  if (!response.body) {
    throw new Error('The response body is empty.');
  }

  const parser = createParser(event => {
    if (event.type === 'event') {
      onProgress?.(event.data);
    }
  });

  let content = '';

  try {
    for await (const chunk of streamAsyncIterable(response.body)) {
      const str = new TextDecoder().decode(chunk);
      parser.feed(str);
    }
  } catch (err) {
    onError?.(err as Error);
  }

  return content;
}

async function* streamAsyncIterable<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
