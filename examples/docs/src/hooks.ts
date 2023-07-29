import { useEffect, useState } from 'react';
import { useDarkMode as useMode } from 'usehooks-ts';

export function useDarkMode() {
  const [defaultMode] = useState(() => {
    const mode = getThemeFromStorage();

    return mode ? mode === 'dark' : void 0;
  });
  const result = useMode(defaultMode);

  useEffect(() => {
    if (result.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', result.isDarkMode ? 'dark' : 'light');
  }, [result.isDarkMode]);

  return result;
}

function getThemeFromStorage() {
  const theme = localStorage.getItem('theme') || '';

  if (!['dark', 'light'].includes(theme)) {
    return null;
  }

  return theme;
}
