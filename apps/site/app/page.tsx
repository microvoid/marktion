'use client';

import { Home } from './page-home';
import { AntdCss } from './provider';

export default function () {
  return (
    <AntdCss>
      <main className="flex min-h-screen flex-col items-center">
        <Home />
      </main>
    </AntdCss>
  );
}
