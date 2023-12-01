'use client';

import { v4 as uuid } from 'uuid';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import Toast from '@app/components/toasts/toast';

export const ToastContext = createContext<ToastContext | undefined>(undefined);

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastDetails = useRef<Record<string, { timeoutId?: number; endTime?: number }>>({});

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(toastDetails.current).forEach((details) => details.timeoutId && clearTimeout(details.timeoutId));
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    const details = toastDetails.current[id];
    if (details) {
      clearTimeout(details.timeoutId);
    }
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type,
      content,
      autoCloseDelay = 5000,
    }: Pick<Toast, 'type' | 'content'> & Partial<Pick<Toast, 'autoCloseDelay'>>) => {
      const id = uuid();

      const toast: Toast = {
        id,
        type,
        content,
        autoCloseDelay,
        remainingTime: autoCloseDelay,
        isPaused: false,
      };

      setToasts((toasts) => [...toasts, toast]);

      const timeoutId = window.setTimeout(() => removeToast(id), toast.autoCloseDelay);
      toastDetails.current[id] = { timeoutId, endTime: Date.now() + toast.autoCloseDelay };
    },
    [removeToast],
  );

  const updateToastStatus = useCallback((id: string, isPaused: boolean) => {
    const details = toastDetails.current[id];
    if (details && details.timeoutId !== undefined) {
      clearTimeout(details.timeoutId);
      details.timeoutId = undefined;
    }

    setToasts((toasts) =>
      toasts.map((toast) =>
        toast.id === id
          ? { ...toast, isPaused, remainingTime: details?.endTime ? details.endTime - Date.now() : 0 }
          : toast,
      ),
    );
  }, []);

  const pauseToast = useCallback((id: string) => updateToastStatus(id, true), [updateToastStatus]);
  const resumeToast = useCallback(
    (id: string) => {
      setToasts((toasts) =>
        toasts.map((toast) => {
          if (toast.id === id && toast.isPaused) {
            const timeoutId = window.setTimeout(() => removeToast(id), toast.remainingTime);
            toastDetails.current[id] = {
              timeoutId,
              endTime: Date.now() + toast.remainingTime,
            };
            return { ...toast, isPaused: false };
          }
          return toast;
        }),
      );
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, pauseToast, resumeToast }}>
      {children}
      <div className="fixed left-0 right-0 top-0 z-50 flex flex-col items-center space-y-1">
        {toasts.map((toast: Toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
