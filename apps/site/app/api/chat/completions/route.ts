import { CreateChatCompletionRequest } from 'openai-edge';
import { StreamingTextResponse } from 'ai';
import { limitHelper } from '@/libs/helpers';
import { createOpenAIStream } from './stream-openai';

export const POST = async (req: Request): Promise<Response> => {
  const body = (await req.json()) as CreateChatCompletionRequest & { projectId?: string };
  const { messages, stream = true, projectId = null, temperature } = body;

  const ip = req.headers.get('x-forwarded-for');

  const { success, limit, remaining } = projectId
    ? await limitHelper.checkAIChatLimit(projectId)
    : await limitHelper.checkAIChatLimitByIp(ip || '');

  if (!success) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString()
      }
    });
  }

  const aiStream = await createOpenAIStream({
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature,
    stream
  });

  // Respond with the stream
  return new StreamingTextResponse(aiStream, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  });
};

export const OPTIONS = () =>
  new Response('ok', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
