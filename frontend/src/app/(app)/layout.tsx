'use client';

import { Providers } from '../context/providers';
import '../../api/config'

const RootLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <Providers>
      <main>
        {children}
      </main>
    </Providers>
  );
};

export default RootLayout;