import { Menu, MenuButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { MdMoreVert } from 'react-icons/md';
import { twJoin, twMerge } from 'tailwind-merge';
import { AnchorProps, dropdownMenuStyles } from './headlessHelpers';
import { SimpleButtonShape, getSimpleButtonClassNames } from './SimpleButton';
import { SimpleDropdownMenuItems } from './SimpleDropdownMenuItems';

function resolveAnchor(anchorItems: AnchorProps): string {
  if (typeof anchorItems === 'string') {
    return anchorItems;
  }

  if (typeof anchorItems === 'object') {
    return anchorItems.to ?? '';
  }

  return '';
}

const baseButtonClassNames =
  'flex justify-center items-center rounded-full disabled:cursor-default text-3xl text-brand';

const anchorRoundingClassNames = twJoin(
  'transition-[border-radius] duration-100 ease-in-out',
  'ui-open:data-[anchor="top_start"]:rounded-tl-none',
  'ui-open:data-[anchor="top_end"]:rounded-tr-none',
  'ui-open:data-[anchor="bottom_end"]:rounded-br-none',
  'ui-open:data-[anchor="bottom_start"]:rounded-bl-none',
);

function getButtonClassNames(
  disabled?: boolean,
  buttonClassName?: string,
  buttonShape?: SimpleButtonShape,
): string {
  if (!buttonShape) {
    return twMerge(baseButtonClassNames, buttonClassName);
  }

  return getSimpleButtonClassNames(
    true,
    disabled,
    buttonShape,
    twJoin(baseButtonClassNames, anchorRoundingClassNames, buttonClassName),
  );
}

type SimpleDropdownMenuProps = {
  readonly anchorItems?: AnchorProps;
  readonly buttonClassName?: string;
  readonly buttonShape?: SimpleButtonShape;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly testId?: string;
  readonly tooltip: string;
};

export const SimpleDropdownMenu: FC<SimpleDropdownMenuProps> = ({
  anchorItems = 'bottom end',
  buttonClassName,
  buttonShape,
  className,
  children,
  disabled,
  testId,
  tooltip,
}) => {
  return (
    <Menu as="div" className={dropdownMenuStyles.root(className)}>
      <MenuButton
        className={getButtonClassNames(disabled, buttonClassName, buttonShape)}
        data-testid={testId}
        data-anchor={resolveAnchor(anchorItems)}
        disabled={disabled}
        aria-label={tooltip}
        title={tooltip}
      >
        <MdMoreVert aria-hidden />
      </MenuButton>

      <SimpleDropdownMenuItems anchor={anchorItems}>
        {children}
      </SimpleDropdownMenuItems>
    </Menu>
  );
};
