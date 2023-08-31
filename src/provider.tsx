import React, { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

export type MarktionCtxValue = {
  darkMode: boolean;
  markdown: string;
  mode: 'visual' | 'source';

  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setMarkdown: React.Dispatch<React.SetStateAction<string>>;
  setMode: React.Dispatch<React.SetStateAction<'visual' | 'source'>>;
};

export type MarktionCtxProps = Partial<Pick<MarktionCtxValue, 'darkMode' | 'markdown' | 'mode'>>;

export const MarktionCtx = React.createContext<MarktionCtxValue | null>(null);

export function MarktionCtxProvider({
  children,
  ...props
}: React.PropsWithChildren<MarktionCtxProps>) {
  const [darkMode, setDarkMode] = useState(props.darkMode || false);
  const [markdown, setMarkdown] = useState(props.markdown || '');
  const [mode, setMode] = useState(props.mode || 'visual');

  useLayoutEffect(() => setDarkMode(props.darkMode!), [props.darkMode]);
  useLayoutEffect(() => setMarkdown(props.markdown!), [props.markdown]);
  useLayoutEffect(() => setMode(props.mode!), [props.mode]);

  return (
    <MarktionCtx.Provider
      value={useMemo(
        () => ({
          darkMode,
          markdown,
          mode,
          setMode,
          setDarkMode,
          setMarkdown
        }),
        [darkMode, markdown, mode]
      )}
    >
      <AntdProvider darkMode={darkMode}>{children}</AntdProvider>
    </MarktionCtx.Provider>
  );
}

export function useMarktionCtx<
  T extends (ctx: MarktionCtxValue) => any = (ctx: MarktionCtxValue) => MarktionCtxValue
>(selector?: T): ReturnType<T> {
  const ctx = useContext(MarktionCtx)!;
  return selector ? selector(ctx) : ctx;
}

export function AntdProvider({
  darkMode,
  children
}: React.PropsWithChildren<{ darkMode?: boolean }>) {
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <StyleProvider hashPriority="high">{children}</StyleProvider>
    </ConfigProvider>
  );
}
