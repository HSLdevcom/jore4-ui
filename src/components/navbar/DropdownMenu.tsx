import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactElement, ReactNode } from 'react';

interface Props {
  buttonContent: ReactNode;
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  testId?: string;
}

export const DropdownMenu = ({
  buttonContent,
  children,
  testId,
}: Props): JSX.Element => {
  const addClassName = (child: ReactElement, newClassName: string) => {
    const className = child.props.className
      ? `${child.props.className} ${newClassName}`
      : newClassName;

    const childProps = {
      className,
    };

    return React.cloneElement(child, childProps);
  };

  return (
    <Menu as="div" className="relative h-full">
      {({ open }) => (
        <>
          <Menu.Button
            className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
            data-testid={testId}
          >
            {buttonContent}
            <img
              src="/icons/chevron-down.png"
              className={`ml-2 h-1.5 transform transition duration-150 ease-in-out ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
              alt=""
            />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
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
