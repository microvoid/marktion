import { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';
import { GptOptions, limitGpt, CreateChatCompletionDeltaResponse, Role } from './api';

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
        const result = await limitGpt(input, {
          config,
          onProgress(message) {
            console.log(message);

            pushOrUpdateMessage(message);
          }
        });

        setLoading(false);

        setMessages(messages => {
          const last = messages.pop();

          if (!last || last.id === question.id) {
            return [...messages, result];
          } else {
            return [...messages, last, result];
          }
        });
      } catch (err) {
        setLoading(false);

        throw err;
      }

      function pushOrUpdateMessage(message: CreateChatCompletionDeltaResponse) {
        setMessages(messages => {
          const finded = messages.find(item => item.id === question.id);
          const deltaContent = message.choices[0].delta.content;
          if (finded && deltaContent) {
            const content = finded.choices[0].delta.content || '';
            finded.choices[0].delta.content = content + deltaContent;

            return [...messages];
          } else {
            return [...messages, message];
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
