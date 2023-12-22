import './globals.css';
import 'marktion/dist/style.css';

import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BasicLayout } from '@/clients/components';

import { Provider } from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marktion, the WYSIWYG Markdown editor',
  description:
    'It provides an intuitive way to edit and preview Markdown text, making it easier for users to create visually appealing documents.'
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-black`}>
        <BasicLayout>
          <Provider>{children}</Provider>
        </BasicLayout>
      </body>
    </html>
  );
}
