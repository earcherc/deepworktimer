type Toast = {
  id: string;
  type: string;
  content: string; // Or JSX.Element
  autoCloseDelay: number;
  remainingTime: number;
  isPaused: boolean;
};

type ToastType = {
  bgColor: string;
  textColor: string;
  progressColor: string;
  icon: React.ReactElement | null;
};

interface ToastContext {
  toasts: Toast[];
  addToast: (toast: Pick<Toast, 'type' | 'content'> & Partial<Pick<Toast, 'autoCloseDelay'>>) => void;
  removeToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
}
