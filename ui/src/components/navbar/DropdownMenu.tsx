import { Menu, Transition } from '@headlessui/react';
import React, { FC, Fragment, PropsWithChildren, ReactNode } from 'react';
import { dropdownTransition } from '../../uiComponents';
import { addClassName } from '../../utils';

type DropdownMenuProps = {
  readonly buttonContent: ReactNode;
  readonly testId?: string;
};

export const DropdownMenu: FC<PropsWithChildren<DropdownMenuProps>> = ({
  buttonContent,
  children,
  testId,
}) => {
  return (
    <Menu as="div" className="relative h-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-4 flex h-full items-center border-b-4 border-transparent px-3 hover:border-white"
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
              className="absolute right-0 w-full origin-top-right rounded-b-md border-t border-black border-opacity-20 bg-brand shadow-md"
            >
              <div className="my-4">
                {React.Children.map(children, (child) => (
                  <Menu.Item>
                    {({ active }) =>
                      React.isValidElement(child) ? (
                        addClassName(
                          child,
                          `${
                            active ? 'bg-brand-darker !rounded-none' : ''
                          } group rounded-md items-center text-center w-full px-4 py-2  focus:outline-none`,
                        )
                      ) : (
                        // Menu.Item requires all the rendered children to be of type ReactElement.
                        // TODO: Is this still true after we update headlessui?
                        <>{child}</>
                      )
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
