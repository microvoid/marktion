import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { GitHubLogoIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { FloatButton, Segmented, Tooltip } from 'antd';
import {
  EditorBubbleMenuPlugin,
  AIPlugin,
  SlashMenuPlugin,
  Marktion,
  MarktionProps,
  MarktionRef
} from './src';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

function App() {
  const marktionRef = useRef<MarktionRef>(null);
  const { isDarkMode, toggle } = useDarkMode();
  const [lang, setLang] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const plugins = useMemo(() => {
    return [EditorBubbleMenuPlugin(), SlashMenuPlugin()];
  }, []);

  const onUploadImage = useCallback<NonNullable<MarktionProps['onUploadImage']>>(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const onExport = () => {
    const content = marktionRef.current?.getMarkdown();

    if (content) {
      const filename = getMarktionTitle(content) || 'marktion';
      downloadFile(`${filename}.md`, content);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setTooltipOpen(true);
    }, 2000);
  }, []);

  return (
    <>
      <header className="w-full p-4  dark:text-gray-100">
        <div className="container flex justify-between items-center h-16 mx-auto">
          <Tooltip open={tooltipOpen} title="Star on Github" placement="right" color="purple">
            <a
              href="https://github.com/microvoid/marktion"
              className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg-stone-100 hover:dark:text-black sm:bottom-auto sm:top-5"
            >
              <GitHubLogoIcon />
            </a>
          </Tooltip>

          <div
            onClick={toggle}
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5"
          >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
      </header>
      <div className="max-w-screen-lg w-full">
        <div className="container flex justify-center">
          <Segmented
            options={[
              {
                label: '中文',
                value: 0
              },
              {
                label: 'English',
                value: 1
              }
            ]}
            value={lang}
            onChange={value => {
              const index = Number(value);

              marktionRef.current?.editor.commands.setMarkdwon(INIT_MARKDOWN[index]);
              setLang(index);
            }}
          />
        </div>

        <Marktion
          ref={marktionRef}
          darkMode={isDarkMode}
          markdown={INIT_MARKDOWN[lang]}
          onUploadImage={onUploadImage}
          plugins={plugins}
        >
          <FloatButton tooltip="Export markdwon file" onClick={onExport} />
        </Marktion>
      </div>
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
  // const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // return isDark ? 'dark' : 'light';

  return 'light';
}

async function downloadFile(filename: string, content: string) {
  const FileSaver = (await import('file-saver')).default;
  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8'
  });

  return FileSaver.saveAs(blob, filename);
}

function getMarktionTitle(markdown: string) {
  const paragraphs = markdown.split('\n');
  const heading = paragraphs.find(item => item.startsWith('#')) || '';

  return heading.replace(/#+\s/, '');
}
