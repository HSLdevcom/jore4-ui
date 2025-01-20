import { ApolloError } from '@apollo/client';
import { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import { Toast, ToastTransition, ToastType } from '../uiComponents';
import { getApolloErrorMessage } from './apolloErrors';

type ToastOptions = {
  readonly className?: string;
  readonly message: ReactNode;
  readonly type?: ToastType;
};

export const showToast = ({
  className,
  message,
  type = 'primary',
}: ToastOptions) => {
  toast.custom((t) => (
    <ToastTransition show={t.visible}>
      <Toast
        className={className}
        message={message}
        toastId={t.id}
        type={type}
      />
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
