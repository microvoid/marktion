'use client';

import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { GUEST_SESSION_KEY } from '@/constants';

export function Provider({ children, guestId }: React.PropsWithChildren<{ guestId: string }>) {
  useEffect(() => {
    setCookie(GUEST_SESSION_KEY, guestId, {
      expires: dayjs().add(2, 'year').toDate(),
      path: '/'
    });
  }, [guestId]);

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
