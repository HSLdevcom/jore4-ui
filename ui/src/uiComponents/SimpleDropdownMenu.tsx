import { Menu } from '@headlessui/react';
import React, { ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import {
  AlignDirection,
  SimpleDropdownMenuItems,
} from './SimpleDropdownMenuItems';

interface Props {
  children: ReactNode;
  testId?: string;
  /** Set value to align menu items to right or left. Default: no alignment */
  alignItems?: AlignDirection;
  tooltip: string;
  disabled?: boolean;
}

export const SimpleDropdownMenu = ({
  children,
  testId,
  alignItems = AlignDirection.NoAlign,
  tooltip,
  disabled,
}: Props): React.ReactElement => {
  return (
    <Menu as="div" className="relative">
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
