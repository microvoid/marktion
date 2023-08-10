import './globals.css';
import 'marktion/dist/style.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from './provider';
import { AuthHandler } from '@/libs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Marktion, the WYSIWYG Markdown editor',
  description:
    'It provides an intuitive way to edit and preview Markdown text, making it easier for users to create visually appealing documents.'
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await AuthHandler.autoGuestAuth();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white dark:bg-black`}>
        <Provider user={user}>{children}</Provider>
      </body>
    </html>
  );
}
