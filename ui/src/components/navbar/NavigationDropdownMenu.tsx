import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { dropdownMenuStyles } from '../../uiComponents';

type NavigationDropdownMenuProps = {
  readonly buttonContent: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
  readonly testId?: string;
};

export const NavigationDropdownMenu: FC<NavigationDropdownMenuProps> = ({
  buttonContent,
  children,
  className,
  testId,
}) => {
  return (
    <Menu as="div" className={dropdownMenuStyles.root(className)}>
      <MenuButton
        className="mx-4 flex h-full items-center border-b-4 border-transparent px-3 hover:border-white"
        data-testid={testId}
      >
        {buttonContent}
        <i
          className="icon-arrow ml-2 transform transition duration-150 ease-in-out ui-open:-rotate-180 ui-not-open:rotate-0"
          style={{ fontSize: 10 }}
        />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className={dropdownMenuStyles.options(
          'ml-4 min-w-[calc(var(--button-width)+2rem)]',
          'bg-brand py-4 text-white',
        )}
        transition
      >
        {children}
      </MenuItems>
    </Menu>
  );
};
