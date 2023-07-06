import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GitHubLogoIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import MarktionEditor from './src/marktion.js';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function App() {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <>
      <header className="w-full p-4  dark:text-gray-100">
        <div className="container flex justify-between items-center h-16 mx-auto">
          <a className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:text-black sm:bottom-auto sm:top-5">
            <GitHubLogoIcon />
          </a>

          <div
            onClick={toggle}
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5"
          >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
      </header>
      <MarktionEditor darkMode={isDarkMode} />
    </>
  );
}

function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    let theme = getThemeFromStorage();

    if (theme === null) {
      theme = getThemeFromSystem();
    }

    return theme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.removeAttribute('data-mode');
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
