import type { TransitionClasses } from '@headlessui/react';

export const accordionClassNames: Readonly<TransitionClasses> = {
  enter: 'transition-[max-height,opacity] overflow-hidden',
  enterFrom: 'max-h-0 opacity-0',
  enterTo: 'max-h-screen opacity-100',
  leave: 'transition-[max-height,opacity] overflow-hidden',
  leaveFrom: 'max-h-screen opacity-100',
  leaveTo: 'max-h-0 opacity-0',
};
