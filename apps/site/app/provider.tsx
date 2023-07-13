'use client';

import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';

export function Provider({ children }: React.PropsWithChildren) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
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
  const withConfig = <AntdProvider>{children}</AntdProvider>;

  renderToString(<StyleProvider cache={cache}>{withConfig}</StyleProvider>);

  return (
    <>
      <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}></style>

      {withConfig}
    </>
  );
}
