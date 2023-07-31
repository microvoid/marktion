import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FloatButton, Segmented } from 'antd';
import { useDarkMode } from 'usehooks-ts';
import { Marktion, MarktionSSR, MarktionProps, MarktionRef } from '../../../dist';
import { Header } from './header';
import { getPlugins } from './plugins';

const INIT_MARKDOWN = [import.meta.env.VITE_README_ZH, import.meta.env.VITE_README_EN];

export function App() {
  const marktionRef = useRef<MarktionRef>(null);
  const { isDarkMode } = useDarkMode();
  const [lang, setLang] = useState(0);
  const [ssr, setSSR] = useState(0);
  const [ssrContent, setSSRContent] = useState(INIT_MARKDOWN[lang]);
  const plugins = useMemo(() => getPlugins(), []);

  useEffect(() => {
    // @ts-ignore
    window['marktion'] = marktionRef;
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

  return (
    <>
      <Header />

      <div className="container max-w-screen-md">
        <div className="flex justify-center">
          <Segmented
            className="mr-4"
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

              // @ts-ignore
              marktionRef.current?.editor.commands.setMarkdwon(INIT_MARKDOWN[index]);
              setLang(index);
            }}
          />

          <Segmented
            options={[
              {
                label: 'CSR',
                value: 0
              },
              {
                label: 'SSR',
                value: 1
              }
            ]}
            value={ssr}
            onChange={value => {
              const content = marktionRef.current?.getMarkdown();

              setSSRContent(content);
              setSSR(Number(value));
            }}
          />
        </div>

        {ssr === 0 && (
          <Marktion
            ref={marktionRef}
            darkMode={isDarkMode}
            markdown={INIT_MARKDOWN[lang]}
            onUploadImage={onUploadImage}
            plugins={plugins}
          >
            <FloatButton tooltip="Export markdwon file" onClick={onExport} />
          </Marktion>
        )}

        {ssr === 1 && <MarktionSSR markdown={ssrContent} />}
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
