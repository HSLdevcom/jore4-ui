import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { addClassName } from '../utils/components';
import { dropdownTransition } from './Listbox';

interface Props {
  children: ReactNode;
  testId?: string;
  /** Set value to align menu items to right or left. Default: no alignment */
  alignItems?: AlignDirection;
  tooltip: string;
}

export enum AlignDirection {
  Right,
  Left,
  NoAlign,
}

const getAlignClassName = (alignItems: AlignDirection) => {
  switch (alignItems) {
    case AlignDirection.Right:
      return 'left-0';
    case AlignDirection.Left:
      return 'right-0';
    default:
      return '';
  }
};

export const SimpleDropdownMenu = ({
  children,
  testId,
  alignItems = AlignDirection.NoAlign,
  tooltip,
}: Props): JSX.Element => {
  const alignClassName = getAlignClassName(alignItems);
  const commonClassName = `${alignClassName} absolute z-10 origin-top-right overflow-visible bg-white text-black shadow-md focus:outline-none`;
  const commonMenuItemClassName = `border-x border-b first-of-type:border-t whitespace-nowrap border-black w-full py-1 px-2 focus:outline-none text-left`;
  const activeMenuItemClassName = `${commonMenuItemClassName} bg-dark-grey text-white`;

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-auto mx-3 flex items-center rounded-full"
            data-testid={testId}
            title={tooltip}
          >
            <MdMoreVert className="aria-hidden text-3xl" />
          </Menu.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Menu.Items static className={commonClassName}>
              {React.Children.map(children, (child) => (
                <Menu.Item>
                  {({ active }) =>
                    React.isValidElement(child)
                      ? addClassName(
                          child,
                          `${
                            active
                              ? activeMenuItemClassName
                              : commonMenuItemClassName
                          }`,
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
