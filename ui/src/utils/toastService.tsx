import { ApolloError } from '@apollo/client';
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

/** This will get the actual error message from ApolloError.
 * There are three different types of errors: network error,
 * graphQLError and client error. Returned message corresponds
 * to the type of the message. If there are multiple error messages,
 * they will be all included.
 */
const getApolloErrorMessage = (err: ApolloError) => {
  if (err.graphQLErrors.length) {
    let errorMessages = '';
    err.graphQLErrors.forEach((gqlError) => {
      // If it is an internal error, we get the message from internal object
      // otherwise it is in the message field.
      errorMessages += `${
        gqlError.extensions?.internal?.error?.message || gqlError.message
      }.`;
    });

    return `GraphQL error: ${errorMessages}`;
  }

  if (err.clientErrors.length) {
    let errorMessages = '';
    err.clientErrors.forEach((clientError) => {
      errorMessages += `${clientError.message}.`;
    });

    return `Client error: ${errorMessages}`;
  }

  if (err.networkError) {
    return `Network error: ${err.networkError.message}`;
  }

  return err.message;
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
