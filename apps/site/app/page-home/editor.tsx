'use client';

import React, { useCallback, useMemo, useRef } from 'react';
import { FloatButton } from 'antd';
import { MarktionRef, MarktionProps, Marktion } from 'marktion';
import { useTheme } from 'next-themes';
import { getPlugins } from './plugins';

export function Editor() {
  const marktionRef = useRef<MarktionRef>(null);
  const { theme } = useTheme();
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

  return (
    <>
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
