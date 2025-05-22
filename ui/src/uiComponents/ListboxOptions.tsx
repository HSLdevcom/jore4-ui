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

type ListboxOptionsProps = {
  readonly options: ReadonlyArray<ListboxOptionRenderer>;
  readonly testId: string;
};

// HUIListbox throws an error if ref is not set when using children component for options
export const ListboxOptions = forwardRef<HTMLDivElement, ListboxOptionsProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function ListboxOptions(
    { options, testId }: ListboxOptionsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): React.ReactElement {
    return (
      <HUIListbox.Options
        as="div"
        data-testid={testId}
        ref={ref}
        className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
      >
        <div>
          {options?.map((item) => (
            <HUIListbox.Option
              as="div"
              id={`listbox-option-${item.key}`}
              key={item.key}
              value={item.value}
            >
              {(optionProps) => {
                const child = item.render(optionProps);
                return React.isValidElement(child) ? (
                  addClassName(
                    child,
                    `${
                      optionProps.active ? 'bg-dark-grey text-white' : ''
                    } flex group text-left px-2 py-2 border-b border-grey`,
                  )
                ) : (
                  // HUIListboxOption requires all the rendered children to be of type ReactElement.
                  <>{child}</>
                );
              }}
            </HUIListbox.Option>
          ))}
        </div>
      </HUIListbox.Options>
    );
  },
);
