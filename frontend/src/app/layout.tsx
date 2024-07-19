import '@styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Deep Work Timer</title>
        <meta name="description" content="Focus on what matters" key="desc" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-gray-900 text-white">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
