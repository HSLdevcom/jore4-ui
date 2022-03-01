import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { addClassName } from '../utils/components';
import { dropdownTransition } from './Listbox';

interface Props {
  children: ReactNode;
  testId?: string;
}

export const SimpleDropdownMenu = ({
  children,
  testId,
}: Props): JSX.Element => {
  return (
    <Menu as="div" className="static h-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-auto flex h-full items-center px-3 focus:outline-none"
            data-testid={testId}
          >
            <MdMoreVert className="text-3xl" />
          </Menu.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Menu.Items
              static
              className="absolute z-10 w-max origin-top-right overflow-visible bg-white text-black shadow-md focus:outline-none"
            >
              {React.Children.map(children, (child) => (
                <Menu.Item>
                  {() =>
                    React.isValidElement(child)
                      ? addClassName(
                          child,
                          `border-x border-b first-of-type:border-t border-black w-full py-1 px-2 focus:outline-none text-left`,
                        )
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
