'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GitHubLogoIcon, SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { FloatButton, Tooltip } from 'antd';
import { MarktionRef, MarktionProps, Marktion } from 'marktion';
import { useTheme } from 'next-themes';
import { getPlugins } from './plugins';

export function Home() {
  const marktionRef = useRef<MarktionRef>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const plugins = useMemo(() => getPlugins(), []);
  const isDarkMode = theme === 'dark';

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
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="rounded-lg cursor-pointer p-2 transition-colors duration-200 hover:bg- hover:text-base sm:bottom-auto sm:top-5"
          >
            {isDarkMode ? <MoonIcon /> : <SunIcon />}
          </div>
        </div>
      </header>
      <div className="max-w-screen-lg w-full flex-1">
        <div className="mt-[50px] pb-[100px]">
          <Marktion
            ref={marktionRef}
            darkMode={isDarkMode}
            markdown={'\n# Marktion\n\nA simple markdown editor'}
            plugins={plugins}
            onUploadImage={onUploadImage}
          >
            <FloatButton tooltip="Export markdwon file" onClick={onExport} />
          </Marktion>
        </div>
      </div>
    </>
  );
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
