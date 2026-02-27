import { FC } from 'react';
import {
  SimpleButtonDropdownMenu,
  SimpleButtonDropdownMenuProps,
} from './SimpleButtonDropdownMenu';

type SlimDropdownMenuProps = Exclude<SimpleButtonDropdownMenuProps, 'shape'>;

export const SlimDropDownMenu: FC<SlimDropdownMenuProps> = ({
  buttonClassName,
  buttonText,
  className,
  disabled,
  children,
  testId,
}: SlimDropdownMenuProps) => (
  <SimpleButtonDropdownMenu
    buttonClassName={buttonClassName}
    buttonText={buttonText}
    className={className}
    disabled={disabled}
    testId={testId}
    shape="slim"
  >
    {children}
  </SimpleButtonDropdownMenu>
);
