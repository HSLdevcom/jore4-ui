import { Transition } from '@headlessui/react';
import React from 'react';

interface Props {
  show: boolean;
}

export const ToastTransition: React.FC<Props> = ({ show, children }) => {
  return (
    <Transition
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
