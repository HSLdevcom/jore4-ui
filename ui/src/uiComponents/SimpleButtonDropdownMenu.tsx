import { Menu, MenuButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { twJoin, twMerge } from 'tailwind-merge';
import { SimpleButtonShape, getSimpleButtonClassNames } from './SimpleButton';
import { SimpleDropdownMenuItems } from './SimpleDropdownMenuItems';

type SimpleButtonDropdownShape = Extract<SimpleButtonShape, 'normal' | 'slim'>;

export type SimpleButtonDropdownMenuProps = {
  readonly buttonText: ReactNode;
  readonly children: ReactNode;
  readonly ariaLabel?: string;
  readonly buttonClassName?: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly disabledTooltip?: string;
  readonly inverted?: boolean;
  readonly shape?: SimpleButtonDropdownShape;
  readonly testId?: string;
};

export const SimpleButtonDropdownMenu: FC<SimpleButtonDropdownMenuProps> = ({
  buttonText,
  children,
  ariaLabel,
  buttonClassName,
  className,
  disabled,
  disabledTooltip,
  inverted,
  shape = 'normal',
  testId,
}) => {
  return (
    <Menu as="div" className={twMerge('relative', className)}>
      <MenuButton
        className={getSimpleButtonClassNames(
          inverted,
          disabled,
          shape,
          twJoin(
            'px-3 transition-[border-radius] ui-open:rounded-r-none ui-not-open:rounded-r-full',
            buttonClassName,
            shape === 'normal' ? 'py-2' : 'py-0',
          ),
        )}
        data-testid={testId}
        disabled={disabled}
        aria-label={ariaLabel}
        title={disabled ? disabledTooltip : undefined}
      >
        <div>{buttonText}</div>
        <div
          aria-hidden="true"
          className={twJoin(
            'mx-2 w-px self-stretch bg-grey',
            shape === 'normal' ? '-my-2' : '',
          )}
        />
        <FaChevronDown aria-hidden="true" focusable="false" />
      </MenuButton>
      <SimpleDropdownMenuItems>{children}</SimpleDropdownMenuItems>
    </Menu>
  );
};
