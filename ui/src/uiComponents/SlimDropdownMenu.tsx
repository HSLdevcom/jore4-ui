import { Menu, MenuButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twJoin, twMerge } from 'tailwind-merge';
import { getSimpleButtonClassNames } from './SimpleButton';
import { SimpleDropdownMenuItems } from './SimpleDropdownMenuItems';

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
      <MenuButton
        className={getSimpleButtonClassNames(
          true,
          disabled,
          'slim',
          twJoin('px-3 py-0 ui-open:rounded-bl-none', buttonClassName),
        )}
        data-testid={testId}
        disabled={disabled}
      >
        <div>{buttonText}</div>
        <div className="mx-2 w-px self-stretch bg-grey" />
        <FaChevronDown />
      </MenuButton>
      <SimpleDropdownMenuItems>{children}</SimpleDropdownMenuItems>
    </Menu>
  );
};
