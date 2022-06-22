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
            className="mx-4 flex h-full items-center border-b-4 border-transparent px-3 hover:border-white focus:outline-none"
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
              className="absolute right-0 w-full origin-top-right rounded-b-md border-t border-black border-opacity-20 bg-brand shadow-md focus:outline-none"
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
