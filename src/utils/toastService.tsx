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
