import { Providers } from '../context/providers';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};

export default RootLayout;
