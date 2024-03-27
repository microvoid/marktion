import { serve } from '@hono/node-server';
import { OpenAPI } from './index';

const PORT = 3003;

serve({
  fetch: OpenAPI.fetch,
  port: PORT
});

console.log(`Server Run1 At: http://127.0.0.1:${PORT}`);
