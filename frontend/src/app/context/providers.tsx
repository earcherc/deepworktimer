'use client';

import AuthProvider from './auth/auth-provider';
import ToastProvider from './toasts/toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
