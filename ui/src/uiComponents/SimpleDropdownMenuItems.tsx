import { Menu, Transition } from '@headlessui/react';
import { Children, FC, Fragment, ReactNode, isValidElement } from 'react';
import { twJoin } from 'tailwind-merge';
import { addClassName } from '../utils';
import { dropdownTransition } from './Listbox';

type SimpleDropdownMenuItemsProps = {
  readonly isOpen: boolean;
  readonly children: ReactNode;
  readonly alignItems: AlignDirection;
};

export enum AlignDirection {
  Top,
  Right,
  RightBottom,
  Left,
  LeftBottom,
  NoAlign,
}

function getAlignClassName(alignItems: AlignDirection) {
  switch (alignItems) {
    case AlignDirection.Top:
      return 'bottom-[calc(100%+10px)]';
    case AlignDirection.Right:
      return 'left-0';
    case AlignDirection.RightBottom:
      return 'left-0 top-full';
    case AlignDirection.Left:
      return 'right-0';
    case AlignDirection.LeftBottom:
      return 'right-0 top-full';
    default:
      return '';
  }
}

const commonClassName = `absolute z-10 origin-top-right overflow-visible bg-white text-black shadow-md focus:outline-none`;
const commonMenuItemClassName = `border-x border-b first-of-type:border-t whitespace-nowrap border-black w-full py-1 px-2 focus:outline-none text-left block`;
const activeMenuItemClassName = `bg-dark-grey text-white`;

export const SimpleDropdownMenuItems: FC<SimpleDropdownMenuItemsProps> = ({
  isOpen,
  children,
  alignItems,
}) => {
  const alignClassName = getAlignClassName(alignItems);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Transition show={isOpen} as={Fragment} {...dropdownTransition}>
      <Menu.Items static className={twJoin(commonClassName, alignClassName)}>
        {Children.map(children, (child) =>
          isValidElement(child) ? (
            <Menu.Item>
              {({ active }) =>
                addClassName(
                  child,
                  twJoin(
                    commonMenuItemClassName,
                    active ? activeMenuItemClassName : '',
                  ),
                )
              }
            </Menu.Item>
          ) : (
            <Menu.Item>{child}</Menu.Item>
          ),
        )}
      </Menu.Items>
    </Transition>
  );
};
