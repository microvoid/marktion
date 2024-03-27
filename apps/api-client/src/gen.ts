import { generateApi } from 'swagger-typescript-api';
import * as path from 'path';

run();

async function run() {
  generateApi({
    name: 'MarktionOpenAPI',
    url: 'http://127.0.0.1:3000/openapi/doc',
    output: path.resolve(process.cwd(), './src/generate'),
    httpClientType: 'axios'
  });
}
