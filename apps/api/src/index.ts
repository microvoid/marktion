import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { handle } from 'hono/vercel';
import { prettyJSON } from 'hono/pretty-json';

import { index } from './routes';

export { handle };
export const OpenAPI = new OpenAPIHono().basePath('/openapi');

index(OpenAPI);

OpenAPI.use('/doc/*', prettyJSON());
OpenAPI.get(
  '/ui',
  swaggerUI({
    url: '/openapi/doc'
  })
);
OpenAPI.doc('/doc', {
  info: {
    title: 'Marktion Open API',
    version: 'v1'
  },
  openapi: '3.1.0'
});
