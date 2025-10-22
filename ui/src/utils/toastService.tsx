import { ApolloError } from '@apollo/client';
import { ReactNode } from 'react';
import { toast } from 'react-hot-toast';
// These need full path imports to avoid cyclic imports.
// Proper fix would be to do s bigger refactoring and include all Toast
// related files in the same directory.
import { Toast, ToastType } from '../uiComponents/Toast';
import { ToastTransition } from '../uiComponents/ToastTransition';
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
  /* Dispatch and queue toasts asynchronously.
   * Improves test compatibility with Navigation blockers and react-hook-forms.
   * We hava a code pattern: ```
   *   const onSubmit = async () => {
   *     await insertData();
   *     showSuccessToast('🎉');
   *   }
   *   ...
   *    <form onSubmit={handleSubmit(onSubmit)> ... </form>
   * ````
   *
   * When handleSubmit is given a function that return a promise it delays the
   * update of the forms state, i.e. the `isSubmitted` and `isSubmitSuccessful`
   * variables won't be set to true before the promise has been resolved.
   *
   * But in onSubmit we have created a toast before those have been set,
   * thus at the time React processes the creation of the Toast and renders
   * it to the DOM, the form is still in "sending" state and not marked as
   * submitted.
   *
   * Then we have test that do: ````
   *   form.getSaveButton().click();
   *   toast.expectSuccessToast('🎉');
   *   modal.getCloseButton().click();
   * ```
   * Which can result in a situation where we tell Cypress to click the close
   * button the same moment the toast appears in the screen. But our React app
   * is lagging one "frame" behind, and internally still considers the form to
   * be dirty/submitting, and we end up blocking the navigation.
   *
   * So, with setTimeout(0ms) we can push the creation of the Toast to end of
   * the browser's async task queue, after the form status update tasks.
   */
  setTimeout(() => {
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
  }, 0);
};

export const showDangerToast = (message: ReactNode) => {
  return showToast({
    message,
    type: 'danger',
  });
};

export const showDangerToastWithError = (
  messageSubject: ReactNode,
  err: unknown,
) => {
  if (err instanceof ApolloError) {
    return showDangerToast(
      <>
        <span>{messageSubject}</span>
        {': '}
        <span>{getApolloErrorMessage(err)}</span>
      </>,
    );
  }

  if (err instanceof Error) {
    return showDangerToast(
      <>
        <span>{messageSubject}</span>
        {': '}
        <span>{err.message}</span>
      </>,
    );
  }

  return showDangerToast(messageSubject);
};

export const showSuccessToast = (message: ReactNode) => {
  return showToast({
    message,
    type: 'success',
  });
};

export const showWarningToast = (message: ReactNode) => {
  return showToast({
    message,
    type: 'warning',
  });
};
