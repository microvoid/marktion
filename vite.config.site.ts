import * as fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

process.env.VITE_README_EN = fs.readFileSync('./README.md', {
  encoding: 'utf8'
});

process.env.VITE_README_ZH = fs.readFileSync('./README-zh_CN.md', {
  encoding: 'utf8'
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-site'
  }
});
