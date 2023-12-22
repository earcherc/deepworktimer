'use client';

import { createStore, Provider as JotaiProvider } from 'jotai';
import ToastProvider from './toasts/toast-provider';
import { Provider as UrqlProvider } from 'urql';
import urqlClient from '@libs/urql';
import { ModalProvider } from './modal/modal-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();

  return (
    <UrqlProvider value={urqlClient}>
      <JotaiProvider store={myStore}>
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </JotaiProvider>
    </UrqlProvider>
  );
}
