'use client';
import Nav from '@app/components/nav';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Nav />
      {children}
    </main>
  );
};

export default RootLayout;
