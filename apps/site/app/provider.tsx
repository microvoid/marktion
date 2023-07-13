'use client';

import { ConfigProvider, theme as AntdTheme } from 'antd';
import { ThemeProvider, useTheme } from 'next-themes';

export function Provider(props: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class">
      <AntdProvider>{props.children}</AntdProvider>
    </ThemeProvider>
  );
}

function AntdProvider(props: React.PropsWithChildren) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm
      }}
    >
      {props.children}
    </ConfigProvider>
  );
}
