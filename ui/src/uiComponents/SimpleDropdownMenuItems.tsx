import { MenuItems } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { AnchorProps, dropdownMenuStyles } from './headlessHelpers';

type SimpleDropdownMenuItemsProps = {
  readonly className?: string;
  readonly children: ReactNode;
  readonly anchor?: AnchorProps;
};

export const SimpleDropdownMenuItems: FC<SimpleDropdownMenuItemsProps> = ({
  anchor = 'bottom end',
  children,
  className,
}) => {
  return (
    <MenuItems
      anchor={anchor}
      className={dropdownMenuStyles.options(className)}
      transition
    >
      {children}
    </MenuItems>
  );
};
