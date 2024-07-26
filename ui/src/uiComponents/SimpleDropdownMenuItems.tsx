import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { addClassName } from '../utils/components';
import { dropdownTransition } from './Listbox';

interface Props {
  isOpen: boolean;
  children: ReactNode;
  alignItems: AlignDirection;
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

export const SimpleDropdownMenuItems = ({
  isOpen,
  children,
  alignItems,
}: Props) => {
  const alignClassName = getAlignClassName(alignItems);
  const commonClassName = `${alignClassName} absolute z-10 origin-top-right overflow-visible bg-white text-black shadow-md focus:outline-none`;
  const commonMenuItemClassName = `border-x border-b first-of-type:border-t whitespace-nowrap border-black w-full py-1 px-2 focus:outline-none text-left`;
  const activeMenuItemClassName = `${commonMenuItemClassName} bg-dark-grey text-white`;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Transition show={isOpen} as={Fragment} {...dropdownTransition}>
      <Menu.Items static className={commonClassName}>
        {React.Children.map(children, (child) => (
          <Menu.Item>
            {({ active }) =>
              React.isValidElement(child)
                ? addClassName(
                    child,
                    `${
                      active ? activeMenuItemClassName : commonMenuItemClassName
                    }`,
                  )
                : child
            }
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  );
};
