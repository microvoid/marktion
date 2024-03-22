import './globals.css';
import '@marktion/ui/styles.css';
import 'marktion/dist/style.css';

import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { BasicLayout, Footer } from '@/clients/components';
import { ClerkProvider } from '@clerk/nextjs';

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
      <ClerkProvider>
        <body className={`${inter.className} bg-white dark:bg-black`}>
          <BasicLayout>
            <Provider>{children}</Provider>
          </BasicLayout>
        </body>
      </ClerkProvider>
    </html>
  );
}
