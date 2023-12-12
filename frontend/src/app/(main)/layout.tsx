import Nav from '@app/components/nav';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full bg-gray-900">
      <Nav></Nav>
      {children}
    </main>
  );
};

export default RootLayout;
