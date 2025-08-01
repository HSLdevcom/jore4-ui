import {
  Listbox as HUIListbox,
  Transition,
  TransitionClasses,
} from '@headlessui/react';
import { FC, Fragment, ReactNode } from 'react';
import { ControllerFieldState, Noop } from 'react-hook-form';
import { ListboxButton } from './ListboxButton';
import { ListboxOptionRenderer, ListboxOptions } from './ListboxOptions';

export const dropdownTransition: TransitionClasses = {
  enter: 'transition ease-out duration-100',
  enterFrom: 'opacity-0 scale-95',
  enterTo: 'opacity-100 scale-100',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'opacity-100 scale-100',
  leaveTo: 'opacity-0 scale-95',
};

// copied from HeadlessUI Listbox as it's not exported
export type ValueFn = (...event: ExplicitAny[]) => void;

export type FormInputProps = {
  readonly value?: string;
  readonly onChange: ValueFn;
  readonly onBlur?: Noop;
  readonly fieldState?: ControllerFieldState;
  readonly disabled?: boolean;
};

type ListboxProps = FormInputProps & {
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly testId?: string;
  readonly options: ReadonlyArray<ListboxOptionRenderer>;
  readonly buttonClassNames?: string;
  readonly arrowButtonClassNames?: string;
};

export const Listbox: FC<ListboxProps> = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
  fieldState,
  buttonClassNames = '',
  arrowButtonClassNames = '',
  disabled = false,
}) => {
  const onItemSelected = (val: string) => {
    const event = { target: { value: val } };
    onChange(event);
  };

  const hasError = !!fieldState?.error;

  return (
    <HUIListbox
      id={id ?? 'listbox'}
      as="div"
      className="relative"
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <ListboxButton
            arrowButtonClassNames={arrowButtonClassNames}
            buttonClassNames={buttonClassNames}
            hasError={hasError}
            testId={`${testId}::ListboxButton`}
            buttonContent={buttonContent}
          />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <ListboxOptions
              testId={`${testId}::ListboxOptions`}
              options={options}
            />
          </Transition>
        </>
      )}
    </HUIListbox>
  );
};
