import { Listbox as HUIListbox } from '@headlessui/react';
import React, { ReactNode, forwardRef } from 'react';
import { addClassName } from '../utils/components';

// copied from HeadlessUI Listbox as it's not exported
export type OptionRenderPropArg = {
  readonly active: boolean;
  readonly selected: boolean;
  readonly disabled: boolean;
};

export type ListboxOptionRenderer = {
  readonly key: string;
  readonly value: string;
  readonly render: (props: OptionRenderPropArg) => ReactNode;
};

type ListboxOptionsProps = {
  readonly options: ReadonlyArray<ListboxOptionRenderer>;
  readonly testId: string;
};

// HUIListbox throws an error if ref is not set when using children component for options
export const ListboxOptions = forwardRef<HTMLDivElement, ListboxOptionsProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function ListboxOptions({ options, testId }, ref) {
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
              data-testid={`${testId}::${item.key}`}
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
