import { ClassNameValue, twMerge } from 'tailwind-merge';

type ClassLists = ReadonlyArray<ClassNameValue>;

function dropdownSelectionOptionStyles(...classLists: ClassLists) {
  return twMerge(
    'flex items-center border-b last:border-b-0 p-2 text-left focus:outline-hidden cursor-default',
    'ui-active:bg-dark-grey ui-active:text-white',
    'ui-selected:bg-dark-grey ui-selected:text-white',
    'ui-disabled:cursor-not-allowed ui-disabled:bg-light-grey',
    ...classLists,
  );
}

function dropdownSelectionOptionsStyles(...classLists: ClassLists) {
  return twMerge(
    'min-w-(--button-width)',
    'z-100 overflow-hidden border border-black/20 bg-white focus:outline-hidden',
    'flex flex-col items-stretch',
    'data-[anchor~="bottom"]:rounded-b-md data-[anchor~="bottom"]:-mt-px data-[anchor~="bottom"]:shadow-md',
    'data-[anchor~="top"]:rounded-t-md data-[anchor~="top"]:mt-px data-[anchor~="top"]:shadow-t-md',
    'transition-opacity ease-in-out duration-100 data-closed:opacity-0',
    ...classLists,
  );
}

function comboboxInputStyles(...classLists: ClassLists) {
  return twMerge(
    'h-full w-full border border-grey bg-white px-2 py-3 focus:outline-hidden',
    'ui-not-open:rounded-md transition-[border-radius] ease-in-out duration-100 ui-open:rounded-none',
    ...classLists,
  );
}

function comboboxButtonStyles(...classLists: ClassLists) {
  return twMerge(
    'absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-hidden',
    ...classLists,
  );
}

export const comboboxStyles = {
  root: (...classLists: ClassLists) => twMerge('relative', ...classLists),
  input: comboboxInputStyles,
  button: comboboxButtonStyles,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
} as const;

function listboxButtonStyles(...classLists: ClassLists) {
  return twMerge(
    'flex h-(--input-height) w-full items-center border border-grey bg-white gap-2 px-2 py-3 text-left',
    'ui-disabled:bg-background ui-disabled:text-dark-grey',
    'ui-not-open:rounded-md transition-[border-radius] ease-in-out duration-100 ui-open:rounded-none',
    ...classLists,
  );
}

export const listboxStyles = {
  root: twMerge,
  button: listboxButtonStyles,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
} as const;

function multiselectListboxOptionStyles(...classLists: ClassLists) {
  return dropdownSelectionOptionStyles(
    'ui-active:[&_svg]:border-white ui-not-selected:[&_svg]:text-transparent',
    // Reset selected style
    'ui-selected:bg-transparent ui-selected:text-inherit',
    ...classLists,
  );
}

export const multiselectListboxStyles = {
  root: twMerge,
  button: listboxButtonStyles,
  option: multiselectListboxOptionStyles,
  options: dropdownSelectionOptionsStyles,
};

export const dropdownMenuStyles = {
  root: twMerge,
  option: dropdownSelectionOptionStyles,
  options: dropdownSelectionOptionsStyles,
};
