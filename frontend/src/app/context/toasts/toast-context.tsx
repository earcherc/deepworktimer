import { useContext } from 'react';
import { ToastContext } from './toast-provider';

const useToast = (): ToastContext => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

export default useToast;
