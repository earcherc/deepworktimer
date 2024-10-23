'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { ModalProvider } from './modal/modal-provider';
import { ThemeProvider } from './theme/theme-context';
import ToastProvider from './toasts/toast-provider';
import { queryClient } from '@lib/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  const myStore = createStore();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider store={myStore}>
        <ThemeProvider>
          <ToastProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastProvider>
        </ThemeProvider>
      </JotaiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
