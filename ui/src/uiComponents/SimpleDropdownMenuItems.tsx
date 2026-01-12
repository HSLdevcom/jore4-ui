import { Menu, Transition } from '@headlessui/react';
import { Children, FC, Fragment, ReactNode } from 'react';
import { dropdownMenuStyles } from './headlessHelpers';
import { dropdownTransition } from './Listbox';

type SimpleDropdownMenuItemsProps = {
  readonly className?: string;
  readonly isOpen: boolean;
  readonly children: ReactNode;
  readonly alignItems: AlignDirection;
};

// TODO: Redo these, currently Left === LeftBottom == NoAlign, Right === RightBottom, with Top rendering "TopLeft".
// We should only have TopLeft, TopRight, BottomLeft & BottomRight
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
      return 'left-0 bottom-[calc(100%+10px)] rounded-t-md rounded-b-none';
    case AlignDirection.Right:
      return 'left-0';
    case AlignDirection.RightBottom:
      return 'left-0 top-full';
    case AlignDirection.Left:
      return 'right-0 left-auto';
    case AlignDirection.LeftBottom:
      return 'right-0 left-auto top-full';
    default:
      return '';
  }
}

export const SimpleDropdownMenuItems: FC<SimpleDropdownMenuItemsProps> = ({
  className,
  isOpen,
  children,
  alignItems,
}) => {
  const alignClassName = getAlignClassName(alignItems);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Transition show={isOpen} as={Fragment} {...dropdownTransition}>
      <Menu.Items
        static
        className={dropdownMenuStyles.options(
          'origin-top-right',
          alignClassName,
          className,
        )}
      >
        {Children.map(children, (child) => (
          <Menu.Item
            as="div"
            className={dropdownMenuStyles.option('whitespace-nowrap')}
          >
            {child}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Transition>
  );
};
