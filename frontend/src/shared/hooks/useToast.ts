import { useCallback, useState } from 'react';

import { ToastProps, ToastType } from '../components/toast';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info', duration?: number) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: ToastProps = {
        id,
        title,
        message,
        type,
        duration,
        onClose: removeToast,
      };

      setToasts(prev => [...prev, toast]);

      // Auto remove after duration
      if (duration !== 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration || 5000);
      }
    },
    [removeToast],
  );

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast(title, message, 'success', duration);
    },
    [showToast],
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast(title, message, 'error', duration);
    },
    [showToast],
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast(title, message, 'warning', duration);
    },
    [showToast],
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast(title, message, 'info', duration);
    },
    [showToast],
  );

  return {
    toasts,
    removeToast,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
