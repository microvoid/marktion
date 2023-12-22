'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';
import { ConfigProvider, theme as AntdTheme } from 'antd';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';

export function Provider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <StyledComponentsRegistry>
        <AntdProvider>{children}</AntdProvider>
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(theme === 'dark');
  }, [theme]);

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
