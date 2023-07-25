import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    let theme = getThemeFromStorage();

    if (theme === null) {
      theme = getThemeFromSystem();
    }

    return theme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return {
    isDarkMode,
    toggle: () => setIsDarkMode(!isDarkMode)
  };
}

function getThemeFromStorage() {
  const theme = localStorage.getItem('theme') || '';

  if (!['dark', 'light'].includes(theme)) {
    return null;
  }

  return theme;
}

function getThemeFromSystem() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return isDark ? 'dark' : 'light';
}
