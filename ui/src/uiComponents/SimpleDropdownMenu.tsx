import { Menu } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import {
  AlignDirection,
  SimpleDropdownMenuItems,
} from './SimpleDropdownMenuItems';

type Props = {
  /** Set value to align menu items to right or left. Default: no alignment */
  readonly alignItems?: AlignDirection;
  readonly buttonClassName?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly testId?: string;
  readonly tooltip: string;
};

export const SimpleDropdownMenu = ({
  alignItems = AlignDirection.NoAlign,
  buttonClassName,
  className,
  children,
  disabled,
  testId,
  tooltip,
}: Props): React.ReactElement => {
  return (
    <Menu as="div" className={twMerge('relative', className)}>
      {({ open }) => (
        <>
          <Menu.Button
            className={twMerge(
              'mx-auto flex items-center rounded-full',
              buttonClassName,
            )}
            data-testid={testId}
            disabled={disabled}
            title={tooltip}
          >
            <MdMoreVert className="aria-hidden text-3xl text-brand" />
          </Menu.Button>
          <SimpleDropdownMenuItems isOpen={open} alignItems={alignItems}>
            {children}
          </SimpleDropdownMenuItems>
        </>
      )}
    </Menu>
  );
};
