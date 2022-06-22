import {
  Listbox as HUIListbox,
  Transition,
  TransitionClasses,
} from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { ControllerFieldState, Noop } from 'react-hook-form';
import { addClassName } from '../utils/components';

// copied from HeadlessUI Listbox as it's not exported
export type ValueFn = (...event: ExplicitAny[]) => void;

// copied from HeadlessUI Listbox as it's not exported
export interface OptionRenderPropArg {
  active: boolean;
  selected: boolean;
  disabled: boolean;
}

interface ListboxOptionRenderer {
  key: string;
  value: string;
  render: (props: OptionRenderPropArg) => ReactNode;
}

export const dropdownTransition: TransitionClasses = {
  enter: 'transition ease-out duration-100',
  enterFrom: 'opacity-0 scale-95',
  enterTo: 'opacity-100 scale-100',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'opacity-100 scale-100',
  leaveTo: 'opacity-0 scale-95',
};

export interface FormInputProps {
  value?: string;
  onChange: ValueFn;
  onBlur: Noop;
  fieldState?: ControllerFieldState;
}

interface Props extends FormInputProps {
  id?: string;
  buttonContent: ReactNode;
  testId?: string;
  options: ListboxOptionRenderer[];
}

const buttonErrorStyles =
  '!border-hsl-red !bg-hsl-red !bg-opacity-5 !border-2 text-hsl-red';

const arrowErrorStyles = 'text-hsl-red';

export const Listbox = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
  fieldState,
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
    >
      {({ open }) => (
        <>
          <HUIListbox.Button
            className={`${
              hasError ? buttonErrorStyles : ''
            } input-element flex w-full items-center text-left focus:outline-none`}
            data-testid={testId}
          >
            {buttonContent}
            <i
              className={`${
                hasError ? arrowErrorStyles : ''
              } icon-arrow ml-auto text-tweaked-brand transition duration-150 ease-in-out ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
              style={{ fontSize: 10 }}
            />
          </HUIListbox.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <HUIListbox.Options
              static
              className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
            >
              <div>
                {options?.map((item) => (
                  <HUIListbox.Option key={item.key} value={item.value}>
                    {(optionProps) => {
                      const child = item.render(optionProps);
                      return React.isValidElement(child)
                        ? addClassName(
                            child,
                            `${
                              optionProps.active ? 'bg-background' : ''
                            } flex group text-left px-2 py-2 focus:outline-none border-b border-grey`,
                          )
                        : child;
                    }}
                  </HUIListbox.Option>
                ))}
              </div>
            </HUIListbox.Options>
          </Transition>
        </>
      )}
    </HUIListbox>
  );
};
