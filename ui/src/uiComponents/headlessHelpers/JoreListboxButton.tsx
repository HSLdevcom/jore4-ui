import { ListboxButton, ListboxButtonProps } from '@headlessui/react';
import { ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { listboxStyles } from './headlessStyles';

const buttonErrorStyles = 'border-hsl-red bg-hsl-red/5 border-2 text-hsl-red';

const arrowErrorStyles = 'text-hsl-red';

type JoreListboxButtonProps = Omit<
  ListboxButtonProps,
  'as' | 'children' | 'className'
> & {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly hasError?: boolean;
  readonly testId?: string;
};

export const JoreListboxButton = forwardRef<
  HTMLButtonElement,
  JoreListboxButtonProps
>(({ children, className, hasError, testId, ...internalProps }, ref) => {
  return (
    <ListboxButton
      ref={ref}
      data-testid={testId}
      className={listboxStyles.button(
        hasError ? buttonErrorStyles : '',
        className,
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...internalProps}
    >
      {children}
      <i
        className={twMerge(
          'icon-arrow ml-auto text-tweaked-brand',
          '-rotate-180 transition duration-150 ease-in-out ui-not-open:rotate-0',
          hasError ? arrowErrorStyles : '',
        )}
        style={{ fontSize: 10 }}
      />
    </ListboxButton>
  );
});

JoreListboxButton.displayName = 'JoreListboxButton';
