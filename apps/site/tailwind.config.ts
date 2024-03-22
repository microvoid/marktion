// tailwind config is required for editor support

import type { Config } from 'tailwindcss';
import sharedConfig from '@marktion/internal-recipe/tailwind-config/tailwind.config';

const config: Pick<Config, 'content' | 'presets'> = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './clients/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  presets: [sharedConfig]
};

export default config;
