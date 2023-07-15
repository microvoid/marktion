'use client';

import { AntdCss } from '../provider';
import { Editor } from './editor';
import { Header } from './header';

export function Home() {
  return (
    <AntdCss>
      <Header />
      <Editor />
    </AntdCss>
  );
}
