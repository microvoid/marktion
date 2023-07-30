import { CreateChatCompletionRequest, OpenAIApi } from 'openai-edge';
import { limitFree } from '@/utils';
import { getConfig } from './config';

const openai = new OpenAIApi(getConfig()!);

export const runtime = 'edge';

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as CreateChatCompletionRequest;
  const { messages, stream } = body;

  const ip = req.headers.get('x-forwarded-for');

  const { success, limit, reset, remaining } = await limitFree(`novel_ratelimit_${ip}`);

  if (!success) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString()
      }
    });
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream,
    n: 1
  });

  // temp
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Respond with the stream
  return response;
}

export const OPTIONS = () =>
  new Response('ok', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
