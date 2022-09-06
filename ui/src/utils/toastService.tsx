import { ApolloError } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { Toast, ToastTransition, ToastType } from '../uiComponents';
import { getApolloErrorMessage } from './apolloErrors';

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

export const showDangerToastWithError = (
  messageSubject: string,
  err: unknown,
) => {
  if (err instanceof ApolloError) {
    return showDangerToast(`${messageSubject}: ${getApolloErrorMessage(err)}`);
  }
  if (err instanceof Error) {
    return showDangerToast(`${messageSubject}: ${err.message}`);
  }
  return showDangerToast(messageSubject);
};

export const showSuccessToast = (message: string) => {
  return showToast({
    message,
    type: 'success',
  });
};

export const showWarningToast = (message: string) => {
  return showToast({
    message,
    type: 'warning',
  });
};
