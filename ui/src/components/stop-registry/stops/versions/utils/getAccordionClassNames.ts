import { twJoin } from 'tailwind-merge';

export function getAccordionClassNames(expanded: boolean) {
  return twJoin(
    'mt-2 transition-[max-height]',
    expanded ? 'max-h-screen' : 'max-h-0 overflow-hidden',
  );
}
