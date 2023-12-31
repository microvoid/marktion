import * as path from 'path';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');
export const UserFirstMarkdown = '# Hello marktion';

export const SessionKey = process.env.SESSION_KEY!;

export const CloudflareR2Constants = {
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID!,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY!,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID!,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME!
};
