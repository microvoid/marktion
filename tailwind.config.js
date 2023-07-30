import { gray, grayDark, blackA, blueDarkA, violet, violetDark } from '@radix-ui/colors';

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './style/index.css'],
  theme: {
    extend: {
      colors: {
        mp: {
          DEFAULT: 'var(--mp-10)',
          1: 'var(--mp-1)',
          2: 'var(--mp-2)',
          3: 'var(--mp-3)',
          4: 'var(--mp-4)',
          5: 'var(--mp-5)',
          6: 'var(--mp-6)',
          7: 'var(--mp-7)',
          8: 'var(--mp-8)',
          9: 'var(--mp-9)',
          10: 'var(--mp-10)',
          11: 'var(--mp-11)',
          12: 'var(--mp-12)',
          foreground: 'var(--mp-10)',
          background: 'var(--mp-1)'
        },
        ...gray,
        ...grayDark,
        ...blackA,
        ...blueDarkA,
        ...violet,
        ...violetDark
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },

      typography: {
        DEFAULT: {
          css: {
            p: {
              margin: 0,
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
