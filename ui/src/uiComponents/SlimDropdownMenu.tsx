import { Menu } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twJoin, twMerge } from 'tailwind-merge';
import { getSimpleButtonClassNames } from './SimpleButton';
import {
  AlignDirection,
  SimpleDropdownMenuItems,
} from './SimpleDropdownMenuItems';

type SlimDropDownMenuProps = {
  readonly buttonClassName?: string;
  readonly buttonText: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly testId?: string;
};

export const SlimDropDownMenu: FC<SlimDropDownMenuProps> = ({
  buttonClassName,
  buttonText,
  className,
  children,
  disabled,
  testId,
}) => {
  return (
    <Menu as="div" className={twMerge('relative', className)}>
      {({ open }) => (
        <>
          <Menu.Button
            className={getSimpleButtonClassNames(
              true,
              disabled,
              twJoin(
                'flex items-center px-3 py-0',
                // Deround bottom left corner, or any other if aligment prop
                // is added to this component too.
                open ? 'rounded-bl-none' : null,
                buttonClassName,
              ),
            )}
            data-testid={testId}
            disabled={disabled}
          >
            <div>{buttonText}</div>
            <div className="mx-2 w-[1px] self-stretch bg-grey" />
            <FaChevronDown />
          </Menu.Button>
          <SimpleDropdownMenuItems
            // Move the menu up by one pixel to "merge"
            // the border with the open button.
            className="-mt-[1px]"
            isOpen={open}
            alignItems={AlignDirection.RightBottom}
          >
            {children}
          </SimpleDropdownMenuItems>
        </>
      )}
    </Menu>
  );
};
