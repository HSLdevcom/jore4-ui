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
  const menuItemClassName = `border-x border-b first-of-type:border-t whitespace-nowrap border-black w-full py-1 px-2 focus:outline-none text-left`;

  return (
    <Menu as="div" className="relative" title={tooltip}>
      {({ open }) => (
        <>
          <Menu.Button
            className="mx-auto flex items-center px-3 focus:outline-none"
            data-testid={testId}
          >
            <MdMoreVert className="aria-hidden text-3xl" />
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
