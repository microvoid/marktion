import './globals.css';
import 'marktion/dist/style.css';

import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import { AuthHelper } from '@/libs';
import { BasicLayout } from '@/clients/components';

import { Provider } from './provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marktion, the WYSIWYG Markdown editor',
  description:
    'It provides an intuitive way to edit and preview Markdown text, making it easier for users to create visually appealing documents.'
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const user = await AuthHelper.guestAuth.autoGuest();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-black`}>
        <BasicLayout>
          <Provider user={user}>{children}</Provider>
        </BasicLayout>
      </body>
    </html>
  );
}
