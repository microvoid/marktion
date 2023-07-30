import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { GptOptions, CreateChatCompletionDeltaResponse, Role, gpt } from './api';

export function useChat(config: GptOptions['config']) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const submit = useCallback(
    async (input: string) => {
      if (loading) {
        return;
      }

      const question: Question = {
        id: nanoid(),
        created: Date.now(),
        choices: [
          {
            delta: {
              role: 'user',
              content: input
            }
          }
        ]
      };

      setMessages(messages => [...messages, question]);
      setLoading(true);

      try {
        let temp: CreateChatCompletionDeltaResponse;
        let deltaContent = '';

        const result = await gpt(input, {
          config,
          onProgress(message) {
            deltaContent = deltaContent + (message.choices[0].delta.content || '');

            if (!temp) {
              temp = message;
              return;
            }

            temp.choices[0].delta.content = deltaContent;

            upsertMessage(temp);
          }
        });

        upsertMessage(result);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        throw err;
      }

      function upsertMessage(message: CreateChatCompletionDeltaResponse) {
        setMessages(messages => {
          const index = messages.findIndex(item => item.id === message.id);

          if (index > -1) {
            messages[index] = message;

            return [...messages];
          } else {
            messages.push(message);

            return [...messages];
          }
        });
      }
    },
    [loading, config]
  );

  return {
    messages,
    loading,
    submit
  };
}

export interface Question {
  id: string;
  created: number;
  choices: [
    {
      delta: {
        role: Role;
        content?: string;
      };
    }
  ];
}

export type Message = CreateChatCompletionDeltaResponse | Question;

export const isAssistant = (message: Message): message is CreateChatCompletionDeltaResponse =>
  message.choices[0].delta.role === 'assistant';
export const isQuestion = (message: Message): message is Question =>
  message.choices[0].delta.role === 'user';
