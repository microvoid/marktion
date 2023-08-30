import { ConfigurationParameters, CreateChatCompletionRequest } from 'openai-edge';

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

export type GptOptions = {
  systemMessage?: string;
  config?: ConfigurationParameters;
  completionConfig?: CreateChatCompletionRequest;
  onProgress?: (event: CreateChatCompletionDeltaResponse) => void;
};
