import { OpenAPI, handle } from 'api/index';

export const runtime = 'edge';

export const GET = handle(OpenAPI);
export const POST = handle(OpenAPI);
