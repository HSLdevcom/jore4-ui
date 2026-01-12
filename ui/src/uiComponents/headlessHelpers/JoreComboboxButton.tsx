import { Combobox } from '@headlessui/react';
import { ReactNode, forwardRef } from 'react';
import { MdSearch } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';

type JoreComboboxButtonProps = Omit<
  Parameters<typeof Combobox.Button>[0],
  'as' | 'children'
> & {
  readonly children?: ReactNode;
  readonly testId?: string;
};

export const JoreComboboxButton = forwardRef<
  HTMLButtonElement,
  JoreComboboxButtonProps
>(({ children, className, testId, ...internalProps }, ref) => {
  return (
    <Combobox.Button
      ref={ref}
      data-testid={testId}
      className={twMerge(
        'absolute inset-y-0 right-0 flex h-full items-center justify-end px-3 text-left focus:outline-none',
        className,
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...internalProps}
    >
      {children}
      <MdSearch className="mr-1 text-2xl text-tweaked-brand" />
      <i
        className="icon-arrow text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
        style={{ fontSize: 10 }}
      />
    </Combobox.Button>
  );
});

JoreComboboxButton.displayName = 'JoreComboboxButton';
