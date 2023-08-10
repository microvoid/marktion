import { createParser } from 'eventsource-parser';
import {
  Configuration,
  OpenAIApi,
  ConfigurationParameters,
  CreateChatCompletionRequest
} from 'openai-edge';
import pLimit from 'p-limit';
import { DEFAULT_GPT_PROMPT } from './constants';

const limit = pLimit(1);

export const limitGpt = (...args: Parameters<typeof gpt>) => limit(() => gpt(...args));

export type GptOptions = {
  systemMessage?: string;
  config?: ConfigurationParameters;
  completionConfig?: CreateChatCompletionRequest;
  onProgress?: (event: CreateChatCompletionDeltaResponse) => void;
};

export async function gpt(content: string, options?: GptOptions) {
  const openai = new OpenAIApi(new Configuration(options?.config));

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: options?.systemMessage || DEFAULT_GPT_PROMPT
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
    n: 1,
    ...options?.completionConfig
  });

  return new Promise<CreateChatCompletionDeltaResponse>((resolve, reject) => {
    let result: CreateChatCompletionDeltaResponse;

    handleStream(response, {
      onError: reject,
      onProgress: message => {
        if (message === '[DONE]') {
          result.choices[0].finish_reason = 'done';

          return resolve(result);
        }

        const event = JSON.parse(message) as CreateChatCompletionDeltaResponse;

        options?.onProgress?.(event);

        if (!result) {
          result = event;
        } else {
          const content = result.choices[0].delta?.content || '';
          const delta = event.choices[0].delta?.content;

          result.choices[0].finish_reason = event.choices[0].finish_reason;

          if (delta) {
            result.choices[0].delta.content = content + delta;
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
