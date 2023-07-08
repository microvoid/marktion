import * as fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

process.env.VITE_README_EN = fs.readFileSync('./README.md', {
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
    lib: { entry: 'src/marktion.tsx', name: 'marktionary' }
  }
});
