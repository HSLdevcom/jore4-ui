import { twJoin } from 'tailwind-merge';

const yBorder = 'border-y border-y-light-grey';
const lBorder = 'border-l border-l-background';
const atWide = '@max-5xl:hidden';
const atNarrow = '@5xl:hidden';

export const stopTableCellClassNames = {
  row: 'text-hsl-dark-80',
  priority: twJoin(yBorder, 'w-0'),
  label: twJoin(yBorder, 'w-0 p-3 align-top'),
  platformNumber: twJoin(yBorder, 'p-3 pl-0'),
  nameWide: twJoin(
    yBorder,
    lBorder,
    atWide,
    'w-full p-3 align-top text-sm @5xl:px-8',
  ),
  iconsWide: twJoin(yBorder, lBorder, atWide, 'w-auto p-3 whitespace-nowrap'),
  nameAndIconsNarrow: twJoin(
    yBorder,
    lBorder,
    atNarrow,
    'w-full p-3 align-top whitespace-nowrap',
  ),
  validity: twJoin(yBorder, lBorder, 'w-auto p-3 align-middle @5xl:px-8'),
  actionButtons: twJoin(yBorder, 'w-0 py-3 pr-1 align-middle @max-5xl:hidden'),
  actionMenu: twJoin(yBorder, 'w-0 p-3 pr-4 align-middle'),
};
