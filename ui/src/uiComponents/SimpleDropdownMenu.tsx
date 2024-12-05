import { Menu } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import {
  AlignDirection,
  SimpleDropdownMenuItems,
} from './SimpleDropdownMenuItems';

type Props = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly testId?: string;
  /** Set value to align menu items to right or left. Default: no alignment */
  readonly alignItems?: AlignDirection;
  readonly tooltip: string;
  readonly disabled?: boolean;
};

export const SimpleDropdownMenu = ({
  className,
  children,
  testId,
  alignItems = AlignDirection.NoAlign,
  tooltip,
  disabled,
}: Props): React.ReactElement => {
  return (
    <Menu as="div" className={twMerge('relative', className)}>
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-3 mx-auto flex items-center rounded-full"
            data-testid={testId}
            disabled={disabled}
            title={tooltip}
          >
            <MdMoreVert className="aria-hidden text-3xl" />
          </Menu.Button>
          <SimpleDropdownMenuItems isOpen={open} alignItems={alignItems}>
            {children}
          </SimpleDropdownMenuItems>
        </>
      )}
    </Menu>
  );
};
