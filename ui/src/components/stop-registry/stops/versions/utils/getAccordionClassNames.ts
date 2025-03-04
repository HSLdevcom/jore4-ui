import { twJoin } from 'tailwind-merge';

export function getAccordionClassNames(expanded: boolean) {
  return twJoin(
    'mt-2 transition-[max-height] overflow-hidden',
    expanded ? 'max-h-screen' : 'max-h-0',
  );
}
