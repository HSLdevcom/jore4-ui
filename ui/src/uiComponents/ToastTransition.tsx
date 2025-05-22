import { Transition } from '@headlessui/react';
import { FC, Fragment, PropsWithChildren } from 'react';

type ToastTransitionProps = {
  readonly show: boolean;
};

export const ToastTransition: FC<PropsWithChildren<ToastTransitionProps>> = ({
  show,
  children,
}) => {
  return (
    <Transition
      // This needs to be a fragment, so that we can match the
      // toast's animation status in e2e tests.
      // We must wait for the toast to be fully visible, before we take a
      // screenshot, or else that will be useless, because we can't see the
      // actual text in it.
      // Current matching is based on opacity getting set to 100 (=='1').
      // See: cypress/pageObjects/Toast.ts
      as={Fragment}
      appear
      show={show}
      enter="transition-all duration-150"
      enterFrom="opacity-0 scale-50"
      enterTo="opacity-100 scale-100"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-75"
    >
      {children}
    </Transition>
  );
};
