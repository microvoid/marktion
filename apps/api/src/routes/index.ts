import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

export function index(api: OpenAPIHono) {
  api.openapi(
    createRoute({
      method: 'get',
      path: '/',
      responses: {
        200: {
          description: 'Index',
          content: {
            'application/json': {
              schema: z.object({
                message: z.string()
              })
            }
          }
        }
      }
    }),
    async c => {
      return c.json({
        message: 'Index'
      });
    }
  );

  api.openapi(
    createRoute({
      method: 'get',
      path: '/health',
      responses: {
        200: {
          description: 'Index'
        }
      }
    }),
    c => {
      return c.text('ok');
    }
  );
}
