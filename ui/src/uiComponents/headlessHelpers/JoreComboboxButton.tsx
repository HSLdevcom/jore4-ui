import { ComboboxButton, ComboboxButtonProps } from '@headlessui/react';
import { ReactNode, forwardRef } from 'react';
import { MdSearch } from 'react-icons/md';
import { comboboxStyles } from './headlessStyles';

type JoreComboboxButtonProps = Omit<
  ComboboxButtonProps,
  'as' | 'children' | 'className'
> & {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly testId?: string;
};

export const JoreComboboxButton = forwardRef<
  HTMLButtonElement,
  JoreComboboxButtonProps
>(({ children, className, testId, ...internalProps }, ref) => {
  return (
    <ComboboxButton
      ref={ref}
      data-testid={testId}
      className={comboboxStyles.button(className)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...internalProps}
    >
      {children}
      <MdSearch className="mr-1 text-2xl text-tweaked-brand" />
      <i
        className="icon-arrow text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
        style={{ fontSize: 10 }}
      />
    </ComboboxButton>
  );
});

JoreComboboxButton.displayName = 'JoreComboboxButton';
