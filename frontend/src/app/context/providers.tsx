'use client';

import { createStore, Provider } from 'jotai';
import ToastProvider from './toasts/toast-provider';
import { Provider as AltProvider } from 'urql';
import urqlClient from '@libs/urql';
import { ModalProvider } from './modal/modal-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();

  return (
    <AltProvider value={urqlClient}>
      <Provider store={myStore}>
        <ModalProvider>
          <ToastProvider>{children}</ToastProvider>
        </ModalProvider>
      </Provider>
    </AltProvider>
  );
}
