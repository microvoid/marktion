import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

export const GUEST_SESSION_KEY = 'marktion-auth.guest-id';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');
export const UserFirstMarkdown = fs.readFileSync(path.join(ROOT, '../../README-zh_CN.md'), 'utf-8');
