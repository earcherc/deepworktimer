import '@styles/globals.css';

import { Inter } from 'next/font/google';
import { Providers } from './context/providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>My Journal</title>
        <meta name="description" content="My Interactive Journal" key="desc" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
