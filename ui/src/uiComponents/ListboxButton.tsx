import { Listbox as HUIListbox } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

const buttonErrorStyles =
  '!border-hsl-red !bg-hsl-red !bg-opacity-5 !border-2 text-hsl-red';

const arrowErrorStyles = 'text-hsl-red';

type ListboxButtonProps = {
  readonly hasError: boolean;
  readonly testId?: string;
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly buttonClassNames?: string;
  readonly arrowButtonClassNames?: string;
};

export const ListboxButton: FC<ListboxButtonProps> = ({
  hasError,
  testId,
  id,
  buttonContent,
  buttonClassNames,
  arrowButtonClassNames,
}) => {
  return (
    <HUIListbox.Button
      className={twMerge(
        'flex h-[var(--input-height)] w-full items-center rounded-md border border-grey bg-white px-2 py-3 text-left',
        'ui-disabled:bg-background ui-disabled:text-dark-grey',
        hasError ? buttonErrorStyles : '',
        buttonClassNames,
      )}
      data-testid={testId}
      id={id}
    >
      {buttonContent}
      <i
        className={twMerge(
          'icon-arrow ml-auto text-tweaked-brand',
          '-rotate-180 transition duration-150 ease-in-out ui-not-open:rotate-0',
          hasError ? arrowErrorStyles : '',
          arrowButtonClassNames,
        )}
        style={{ fontSize: 10 }}
      />
    </HUIListbox.Button>
  );
};
