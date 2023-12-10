'use client';

import { createStore, Provider } from 'jotai';
import ToastProvider from './toasts/toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();

  return (
    <Provider store={myStore}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
