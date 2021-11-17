import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { dropdownTransition } from '../../uiComponents';
import { addClassName } from '../../utils';

interface Props {
  buttonContent: ReactNode;
  children: ReactNode;
  testId?: string;
}

export const DropdownMenu = ({
  buttonContent,
  children,
  testId,
}: Props): JSX.Element => {
  return (
    <Menu as="div" className="relative h-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
            data-testid={testId}
          >
            {buttonContent}
            <i
              className={`icon-arrow ml-2 transform transition duration-150 ease-in-out ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
              style={{ fontSize: 10 }}
            />
          </Menu.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Menu.Items
              static
              className="absolute right-0 w-full bg-brand border-t border-black border-opacity-20 rounded-b-md focus:outline-none shadow-md origin-top-right"
            >
              <div className="my-4">
                {React.Children.map(children, (child) => (
                  <Menu.Item>
                    {({ active }) =>
                      React.isValidElement(child)
                        ? addClassName(
                            child,
                            `${
                              active ? 'bg-brand-darker !rounded-none' : ''
                            } group rounded-md items-center text-center w-full px-4 py-2  focus:outline-none`,
                          )
                        : child
                    }
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
