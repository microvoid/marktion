import { gray, grayDark, blackA, blueDarkA } from '@radix-ui/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './style/index.css'],
  theme: {
    extend: {
      colors: {
        ...gray,
        ...grayDark,
        ...blackA,
        ...blueDarkA
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },

      typography: {
        DEFAULT: {
          css: {
            p: {
              '&:first-of-type::before': {
                content: 'none'
              },
              '&:last-of-type::after': {
                content: 'none'
              }
            }
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
