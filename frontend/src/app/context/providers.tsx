'use client';

import { queryClient } from '@lib/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { ModalProvider } from './modal/modal-provider';
import ToastProvider from './toasts/toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={myStore}>
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </JotaiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
