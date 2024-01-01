'use client';

import { useTheme } from 'next-themes';

import { Icon } from './icon';

export function DarkModeBtn() {
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
      className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:bg-stone-700 sm:bottom-auto sm:top-5"
    >
      <Icon name={isDarkMode ? 'moon' : 'sun'} size={18} />
    </button>
  );
}
