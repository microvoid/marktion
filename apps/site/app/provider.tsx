'use client';

import { renderToString } from 'react-dom/server';
import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { setCookie } from 'cookies-next';
import React, { useLayoutEffect } from 'react';
import dayjs from 'dayjs';
import { LoginUserContext, GUEST_SESSION_ID, ModelContextProvider } from '@/clients';
import { User } from '@prisma/client';

export function Provider({ children, user }: React.PropsWithChildren<{ user: User }>) {
  useLayoutEffect(() => {
    if (user.anonymous) {
      setCookie(GUEST_SESSION_ID, user.id, {
        expires: dayjs().add(5, 'year').toDate(),
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
  const { theme } = useTheme();

  const darkMode = theme === 'dark';

  const withConfig = (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm
      }}
    >
      <ModelContextProvider>{children}</ModelContextProvider>
    </ConfigProvider>
  );

  renderToString(<StyleProvider cache={cache}>{withConfig}</StyleProvider>);

  return (
    <>
      <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}></style>

      {withConfig}
    </>
  );
}
