import * as fs from 'fs';
import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

process.env.VITE_README_EN = fs.readFileSync('./README.md', {
  encoding: 'utf8'
});

process.env.VITE_README_ZH = fs.readFileSync('./README-zh_CN.md', {
  encoding: 'utf8'
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    minify: false,
    lib: { entry: 'src/index.ts', name: 'marktion' },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
});
