'use client';

import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <AntdProvider>{children}</AntdProvider>
    </ThemeProvider>
  );
}

function AntdProvider({ children }: React.PropsWithChildren) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export function AntdCss({ children }: React.PropsWithChildren) {
  const cache = createCache();

  renderToString(<StyleProvider cache={cache}>{children}</StyleProvider>);

  return (
    <>
      <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}></style>
      {children}
    </>
  );
}
