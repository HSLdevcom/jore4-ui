import { Listbox as HUIListbox } from '@headlessui/react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const buttonErrorStyles =
  '!border-hsl-red !bg-hsl-red !bg-opacity-5 !border-2 text-hsl-red';

const arrowErrorStyles = 'text-hsl-red';
interface Props {
  open: boolean;
  hasError: boolean;
  testId?: string;
  buttonContent: ReactNode;
  buttonClassNames?: string;
  arrowButtonClassNames?: string;
  disabled?: boolean;
}
export const ListboxButton = ({
  open,
  hasError,
  testId,
  buttonContent,
  buttonClassNames,
  arrowButtonClassNames,
  disabled,
}: Props): JSX.Element => {
  return (
    <HUIListbox.Button
      className={twMerge(
        `${hasError ? buttonErrorStyles : ''} ${
          disabled ? 'input-disabled' : ''
        } flex w-full items-center rounded-md border border-grey bg-white py-3 px-2 text-left  ${buttonClassNames}`,
      )}
      data-testid={testId}
    >
      {buttonContent}
      <i
        className={twMerge(
          `${
            hasError ? arrowErrorStyles : ''
          } icon-arrow ml-auto text-tweaked-brand transition duration-150 ease-in-out ${
            open ? '-rotate-180' : 'rotate-0'
          } ${arrowButtonClassNames}`,
        )}
        style={{ fontSize: 10 }}
      />
    </HUIListbox.Button>
  );
};
