import { MenuItem } from '@headlessui/react';
import {
  ForwardRefRenderFunction,
  MouseEventHandler,
  ReactNode,
  SyntheticEvent,
  forwardRef,
} from 'react';
import * as React from 'react';
import { Link, To } from 'react-router';
import { dropdownMenuStyles } from './headlessHelpers';

function preventDefault<E extends SyntheticEvent<unknown>>(e: E) {
  e.preventDefault();
}

type SimpleDropdownMenuItemBaseProps = {
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

type SimpleDropdownMenuItemButtonProps = {
  readonly onClick: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  readonly to?: never;
};

type SimpleDropdownMenuItemLinkProps = {
  readonly onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  readonly to: To;
};

type SimpleDropdownMenuItemProps = SimpleDropdownMenuItemBaseProps &
  (SimpleDropdownMenuItemButtonProps | SimpleDropdownMenuItemLinkProps);

const SimpleDropdownMenuItemComponent: ForwardRefRenderFunction<
  HTMLButtonElement | HTMLAnchorElement,
  SimpleDropdownMenuItemProps
> = (
  {
    onClick,
    to,
    text,
    children,
    disabled,
    testId,
    className,
    title,
    ...dataAttributes
  },
  ref,
) => {
  if (to) {
    return (
      <MenuItem
        as={Link}
        ref={ref}
        className={dropdownMenuStyles.option('whitespace-nowrap', className)}
        title={title}
        data-testid={testId}
        data-headlessui-state={!!disabled}
        {...(disabled ? { to, onClick: preventDefault } : { to, onClick })}
        {...dataAttributes}
      >
        {text ?? children}
      </MenuItem>
    );
  }

  return (
    <MenuItem
      as="button"
      ref={ref}
      type="button"
      className={dropdownMenuStyles.option('whitespace-nowrap', className)}
      title={title}
      disabled={disabled}
      data-testid={testId}
      data-headlessui-state={!!disabled}
      onClick={onClick}
      {...dataAttributes}
    >
      {text ?? children}
    </MenuItem>
  );
};

export const SimpleDropdownMenuItem = forwardRef(
  SimpleDropdownMenuItemComponent,
);
