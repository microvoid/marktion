import { type UseChatOptions } from 'ai/react';

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

export type GptConfig = Partial<
  UseChatOptions & {
    apiKey: string;
  }
>;
