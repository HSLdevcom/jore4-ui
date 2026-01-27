import { Menu, MenuButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { AnchorProps, dropdownMenuStyles } from './headlessHelpers';
import { SimpleDropdownMenuItems } from './SimpleDropdownMenuItems';

type SimpleDropdownMenuProps = {
  readonly anchorItems?: AnchorProps;
  readonly buttonClassName?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly testId?: string;
  readonly tooltip: string;
};

export const SimpleDropdownMenu: FC<SimpleDropdownMenuProps> = ({
  anchorItems,
  buttonClassName,
  className,
  children,
  disabled,
  testId,
  tooltip,
}) => {
  return (
    <Menu as="div" className={dropdownMenuStyles.root(className)}>
      <MenuButton
        className={twMerge(
          'mx-auto flex cursor-pointer items-center rounded-full disabled:cursor-default',
          buttonClassName,
        )}
        data-testid={testId}
        disabled={disabled}
        title={tooltip}
      >
        <MdMoreVert aria-hidden className="text-3xl text-brand" />
      </MenuButton>

      <SimpleDropdownMenuItems anchor={anchorItems}>
        {children}
      </SimpleDropdownMenuItems>
    </Menu>
  );
};
