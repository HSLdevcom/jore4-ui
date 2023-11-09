import {
  Listbox as HUIListbox,
  Transition,
  TransitionClasses,
} from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
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

export interface FormInputProps {
  value?: string;
  onChange: ValueFn;
  onBlur?: Noop;
  fieldState?: ControllerFieldState;
  disabled?: boolean;
}

interface Props extends FormInputProps {
  id?: string;
  buttonContent: ReactNode;
  testId?: string;
  options: ListboxOptionRenderer[];
  buttonClassNames?: string;
  arrowButtonClassNames?: string;
}

export const Listbox = ({
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
}: Props): JSX.Element => {
  const onItemSelected = (val: string) => {
    const event = { target: { value: val } };
    onChange(event);
  };

  const hasError = !!fieldState?.error;

  return (
    <HUIListbox
      id={id || 'listbox'}
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
            open={open}
            hasError={hasError}
            testId={`${testId}::ListboxButton`}
            buttonContent={buttonContent}
            disabled={disabled}
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
