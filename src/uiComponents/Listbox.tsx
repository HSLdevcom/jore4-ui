import {
  Listbox as HUIListbox,
  Transition,
  TransitionClasses,
} from '@headlessui/react';
import React, { Fragment, ReactNode } from 'react';
import { Noop } from 'react-hook-form';
import { addClassName } from '../utils';

// copied from HeadlessUI Listbox as it's not exported
export type ValueFn = (...event: ExplicitAny[]) => void;

// copied from HeadlessUI Listbox as it's not exported
interface OptionRenderPropArg {
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
  enterFrom: 'transform opacity-0 scale-95',
  enterTo: 'transform opacity-100 scale-100',
  leave: 'transition ease-in duration-75',
  leaveFrom: 'transform opacity-100 scale-100',
  leaveTo: 'transform opacity-0 scale-95',
};

export interface FormInputProps {
  value?: string;
  onChange: ValueFn;
  onBlur: Noop;
}

interface Props extends FormInputProps {
  buttonContent: ReactNode;
  testId: string;
  options: ListboxOptionRenderer[];
}

export const Listbox = ({
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const onItemSelected = (val: string) => {
    const event = { target: { value: val } };
    onChange(event);
  };

  return (
    <HUIListbox
      as="div"
      className="relative h-full"
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
    >
      {({ open }) => (
        <>
          <HUIListbox.Button
            className="flex items-center w-full h-full border border-grey rounded focus:outline-none"
            data-testid={testId}
          >
            {buttonContent}
            <i
              className={`icon-arrow ml-2 transform transition duration-150 ease-in-out ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
              style={{ fontSize: 10 }}
            />
          </HUIListbox.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <HUIListbox.Options
              static
              className="absolute right-0 w-full bg-white border border-black border-opacity-20 rounded-b-md focus:outline-none shadow-md origin-top-right"
            >
              <div className="my-4">
                {options?.map((item) => (
                  <HUIListbox.Option key={item.key} value={item.value}>
                    {(optionProps) => {
                      const child = item.render(optionProps);
                      return React.isValidElement(child)
                        ? addClassName(
                            child,
                            `${
                              optionProps.active ? 'bg-brand !rounded-none' : ''
                            } group rounded-md items-center text-center w-full px-4 py-2 focus:outline-none`,
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
