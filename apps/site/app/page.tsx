import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Home } from './page-home';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_README_ZH = fs.readFileSync(path.join(__dirname, '../../../README-zh_CN.md'), 'utf-8');
const VITE_README_EN = fs.readFileSync(path.join(__dirname, '../../../README.md'), 'utf-8');

const INIT_MARKDOWN = [VITE_README_ZH, VITE_README_EN];

export default function () {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Home INIT_MARKDOWN={INIT_MARKDOWN} />
    </main>
  );
}
