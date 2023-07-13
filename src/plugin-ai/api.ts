import {
  Configuration,
  OpenAIApi,
  ConfigurationParameters,
  CreateChatCompletionResponse
} from 'openai-edge';

export async function gpt(content: string, config?: ConfigurationParameters) {
  const openai = new OpenAIApi(
    new Configuration({
      apiKey: import.meta.env.VITE_OPENAI_TOKEN,
      basePath: import.meta.env.VITE_OPENAI_PROXY_URL,
      ...config
    })
  );

  const completion = await openai.createChatCompletion({
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
    // stream: true,
    stream: false,
    n: 1
  });

  const response = new Response(completion.body);
  const body: CreateChatCompletionResponse = await response.json();

  console.log(body);
}
