import { ApiError } from '@api';

export const createMutationErrorHandler = (addToast: ToastContext['addToast']) => {
  return (action: string) => (error: unknown) => {
    const errorMessage =
      error instanceof ApiError ? error.body?.detail || `Failed to ${action}` : `Failed to ${action}`;
    addToast({
      type: 'error',
      content: errorMessage,
    });
    console.error(`Error ${action}:`, errorMessage);
  };
};
