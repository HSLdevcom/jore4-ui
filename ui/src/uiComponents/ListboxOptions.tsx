import { Listbox as HUIListbox } from '@headlessui/react';
import React, { ForwardedRef, ReactNode, forwardRef } from 'react';
import { addClassName } from '../utils/components';

// copied from HeadlessUI Listbox as it's not exported
export interface OptionRenderPropArg {
  active: boolean;
  selected: boolean;
  disabled: boolean;
}

export interface ListboxOptionRenderer {
  key: string;
  value: string;
  render: (props: OptionRenderPropArg) => ReactNode;
}

interface Props {
  options: ListboxOptionRenderer[];
}

// HUIListbox throws an error if ref is not set when using children component for options
export const ListboxOptions = forwardRef<HTMLUListElement, Props>(
  // eslint-disable-next-line prefer-arrow-callback
  function MyComponent(
    { options }: Props,
    ref: ForwardedRef<HTMLUListElement>,
  ): JSX.Element {
    return (
      <HUIListbox.Options
        ref={ref}
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
    );
  },
);
