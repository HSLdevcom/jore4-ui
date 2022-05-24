import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { addClassName } from '../utils/components';
import { dropdownTransition } from './Listbox';

interface Props {
  children: ReactNode;
  testId?: string;
  /** Set to true if you want to open the menu items right */
  openMenuItemsRight?: boolean;
  /** Set to true if you want to open the menu items left */
  openMenuItemsLeft?: boolean;
}

export const SimpleDropdownMenu = ({
  children,
  testId,
  openMenuItemsRight = false,
  openMenuItemsLeft = false,
}: Props): JSX.Element => {
  const rightClassName = openMenuItemsLeft ? 'right-0' : '';
  const leftClassName = openMenuItemsRight ? 'left-0' : '';

  const commonClassName = `${rightClassName} ${leftClassName} absolute z-10 origin-top-right overflow-visible bg-white text-black shadow-md focus:outline-none`;
  const menuItemClassName = `border-x border-b first-of-type:border-t whitespace-nowrap border-black w-full py-1 px-2 focus:outline-none text-left`;

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-auto flex items-center px-3 focus:outline-none"
            data-testid={testId}
          >
            <MdMoreVert className="text-3xl" />
          </Menu.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Menu.Items static className={commonClassName}>
              {React.Children.map(children, (child) => (
                <Menu.Item>
                  {() =>
                    React.isValidElement(child)
                      ? addClassName(child, menuItemClassName)
                      : child
                  }
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
