import { ClassNameValue, twMerge } from 'tailwind-merge';

type ClassLists = ReadonlyArray<ClassNameValue>;

function dropdownSelectionOptionStyles(...classLists: ClassLists) {
  return twMerge(
    'flex items-center border-b last:border-b-0 p-2 text-left focus:outline-none cursor-default',
    'ui-active:bg-dark-grey ui-active:text-white',
    'ui-selected:bg-dark-grey ui-selected:text-white',
    'ui-disabled:cursor-not-allowed ui-disabled:bg-light-grey',
    ...classLists,
  );
}

function dropdownSelectionOptionsStyles(...classLists: ClassLists) {
  return twMerge(
    'absolute left-0 z-10 min-w-full overflow-hidden rounded-b-md border border-black border-opacity-20 bg-white shadow-md',
    ...classLists,
  );
}

function dropdownSelectionRootStyles(...classLists: ClassLists) {
  return twMerge('relative', ...classLists);
}

function comboboxInputStyles(...classLists: ClassLists) {
  return twMerge(
    'relative h-full w-full rounded-md border border-grey bg-white px-2 py-3 focus:outline-none',
    'ui-open:rounded-b-none ui-open:border-b-0 ui-open:pb-[calc(0.75rem+1px)]',
    // Override above ones, if we are nested within a modal
    'ui-not-open:rounded-b-md ui-not-open:border-b ui-not-open:pb-3',
    ...classLists,
  );
}

function comboboxButtonStyles(...classLists: ClassLists) {
  return twMerge(
    'absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-none',
    ...classLists,
  );
}

export const comboboxStyles = {
  root: dropdownSelectionRootStyles,
  input: comboboxInputStyles,
  button: comboboxButtonStyles,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
} as const;

function listboxButtonStyles(...classLists: ClassLists) {
  return twMerge(
    'flex h-[var(--input-height)] w-full items-center rounded-md border border-grey bg-white gap-2 px-2 py-3 text-left',
    'ui-disabled:bg-background ui-disabled:text-dark-grey',
    'ui-open:rounded-b-none ui-open:border-b-0 ui-open:pb-[calc(0.75rem+1px)]',
    // Override above ones, if we are nested within a modal
    'ui-not-open:rounded-b-md ui-not-open:border-b ui-not-open:pb-3',
    ...classLists,
  );
}

export const listboxStyles = {
  root: dropdownSelectionRootStyles,
  button: listboxButtonStyles,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
} as const;

function multiselectListboxOptionStyles(...classLists: ClassLists) {
  return dropdownSelectionOptionStyles(
    '[&_svg]:ui-active:border-white [&_svg]:ui-not-selected:text-transparent',
    // Reset selected style
    'ui-selected:bg-transparent ui-selected:text-inherit',
    ...classLists,
  );
}

export const multiselectListboxStyles = {
  root: dropdownSelectionRootStyles,
  button: listboxButtonStyles,
  option: multiselectListboxOptionStyles,
  options: dropdownSelectionOptionsStyles,
};

export const dropdownMenuStyles = {
  root: dropdownSelectionRootStyles,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
};
