'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { setCookie } from 'cookies-next';
import React, { useLayoutEffect } from 'react';
import dayjs from 'dayjs';
import { GUEST_SESSION_ID, ModelContextProvider } from '@/clients';
import { User } from '@prisma/client';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';

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
      <StyledComponentsRegistry>
        <AntdProvider>
          <ModelContextProvider user={user}>{children}</ModelContextProvider>
        </AntdProvider>
      </StyledComponentsRegistry>
    </ThemeProvider>
  );
}

function StyledComponentsRegistry({ children }: React.PropsWithChildren) {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) {
      return;
    }

    isServerInserted.current = true;

    return <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />;
  });

  return (
    <StyleProvider cache={cache} hashPriority="high">
      {children}
    </StyleProvider>
  );
}

export function AntdProvider({ children }: React.PropsWithChildren) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          colorPrimary: '#722ed1'
        },
        algorithm: darkMode ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm
      }}
    >
      {children}
    </ConfigProvider>
  );
}
