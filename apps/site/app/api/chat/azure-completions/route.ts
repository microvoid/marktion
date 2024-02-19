import { StreamingTextResponse } from 'ai';
import { limitHelper } from '@/libs/helpers';
import { createAzureAIStream } from './stream-azure';
import { ChatRequestMessage, GetChatCompletionsOptions } from '@azure/openai';

export const POST = async (req: Request): Promise<Response> => {
  const body = await req.json();

  const messages: ChatRequestMessage[] = body.messages;
  const projectId = body.projectId || null;
  const { temperature } = body as GetChatCompletionsOptions;

  const ip = req.headers.get('x-forwarded-for');

  const { success, limit, remaining } = projectId
    ? await limitHelper.checkAIChatLimit(projectId)
    : await limitHelper.checkAIChatLimitByIp(ip || '');

  if (!success) {
    return new Response('You have reached your request limit for the day.', {
      status: 429,
      headers: {
        ...corsHeaders,
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString()
      }
    });
  }

  const aiStream = await createAzureAIStream(messages, {
    temperature
  });

  // Respond with the stream
  return new StreamingTextResponse(aiStream, {
    headers: corsHeaders
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
