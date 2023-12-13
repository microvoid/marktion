'use client';

import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { setCookie } from 'cookies-next';
import React, { useLayoutEffect } from 'react';
import dayjs from 'dayjs';
import { GUEST_SESSION_KEY } from '@/clients';
import { User } from '@prisma/client';
import { LoginUserContext } from './hooks';

export function Provider({ children, user }: React.PropsWithChildren<{ user: User }>) {
  useLayoutEffect(() => {
    if (user.anonymous) {
      setCookie(GUEST_SESSION_KEY, user.id, {
        expires: dayjs().add(2, 'year').toDate(),
        path: '/'
      });
    }
  }, [user]);

  return (
    <ThemeProvider attribute="class">
      <LoginUserContext.Provider value={user}>{children}</LoginUserContext.Provider>
    </ThemeProvider>
  );
}

export function AntdProvider({ children }: React.PropsWithChildren) {
  const cache = createCache();
  const withConfig = <AntdConfigProvider>{children}</AntdConfigProvider>;

  renderToString(<StyleProvider cache={cache}>{withConfig}</StyleProvider>);

  return (
    <>
      <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}></style>

      {withConfig}
    </>
  );
}

function AntdConfigProvider({ children }: React.PropsWithChildren) {
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
