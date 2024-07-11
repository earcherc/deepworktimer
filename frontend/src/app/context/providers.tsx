'use client';

import { createStore, Provider as JotaiProvider } from 'jotai';
import ToastProvider from './toasts/toast-provider';
import { ModalProvider } from './modal/modal-provider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@lib/react-query';

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
