import { MenuItem } from '@headlessui/react';
import { ForwardRefRenderFunction, ReactNode, forwardRef } from 'react';
import { dropdownMenuStyles } from './headlessHelpers';

type SimpleDropdownMenuItemProps = {
  readonly onClick: () => void;
  readonly disabled?: boolean;
  readonly testId: string;
  readonly className?: string;
  readonly title?: string;
} & (
  | { readonly text: string; readonly children?: never }
  | { readonly text?: never; readonly children: ReactNode }
) & {
    readonly [key in `data-${string}`]?: string;
  };

const SimpleDropdownMenuItemComponent: ForwardRefRenderFunction<
  HTMLButtonElement,
  SimpleDropdownMenuItemProps
> = (
  {
    text,
    children,
    onClick,
    disabled,
    testId,
    className,
    title,
    ...dataAttributes
  },
  ref,
) => {
  return (
    <MenuItem
      as="button"
      ref={ref}
      disabled={disabled}
      className={dropdownMenuStyles.option('whitespace-nowrap', className)}
      type="button"
      onClick={onClick}
      data-testid={testId}
      title={title}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...dataAttributes}
    >
      {text ?? children}
    </MenuItem>
  );
};

export const SimpleDropdownMenuItem = forwardRef(
  SimpleDropdownMenuItemComponent,
);
