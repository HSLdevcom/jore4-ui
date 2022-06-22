import { toast } from 'react-hot-toast';
import { Toast, ToastTransition, ToastType } from '../uiComponents';

interface ToastOptions {
  message: string;
  type?: ToastType;
}

export const showToast = (options: ToastOptions) => {
  const { message, type = 'primary' } = options;
  toast.custom((t) => (
    <ToastTransition show={t.visible}>
      <Toast type={type} message={message} />
    </ToastTransition>
  ));
};

export const showDangerToast = (message: string) => {
  return showToast({
    message,
    type: 'danger',
  });
};

export const showDangerToastWithError = (message: string, err: unknown) => {
  if (err instanceof Error) {
    return showDangerToast(`${message}: ${err.message}`);
  }
  return showDangerToast(message);
};

export const showSuccessToast = (message: string) => {
  return showToast({
    message,
    type: 'success',
  });
};
