import { MenuItem } from '@headlessui/react';
import { FC, ReactNode } from 'react';

const className =
  'group w-full items-center px-4 py-2 text-center focus:outline-hidden ui-active:bg-brand-darker';

type NavigationDropdownMenuButtonProps = {
  readonly children: ReactNode;
  readonly onClick: () => void;
  readonly testId?: string;
};

export const NavigationDropdownMenuButton: FC<
  NavigationDropdownMenuButtonProps
> = ({ children, onClick, testId }) => (
  <MenuItem
    as="button"
    className={className}
    data-testid={testId}
    onClick={onClick}
    type="button"
  >
    {children}
  </MenuItem>
);

type NavigationDropdownMenuLinkOutProps = {
  readonly children: ReactNode;
  readonly href: string;
  readonly testId?: string;
};

export const NavigationDropdownMenuLinkOut: FC<
  NavigationDropdownMenuLinkOutProps
> = ({ children, href, testId }) => (
  <MenuItem as="a" className={className} data-testid={testId} href={href}>
    {children}
  </MenuItem>
);
