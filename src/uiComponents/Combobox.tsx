import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { Noop } from 'react-hook-form';
import { MdCheck, MdSearch } from 'react-icons/md';
import { dropdownTransition, OptionRenderPropArg, ValueFn } from './Listbox';

export interface ComboboxInputProps {
  value?: string;
  onChange: ValueFn;
  onBlur?: Noop;
}

interface ComboboxOptionRenderer {
  key: string;
  value: string;
  render: (props: OptionRenderPropArg) => ReactNode;
}

interface Props extends ComboboxInputProps {
  id?: string;
  buttonContent: ReactNode;
  testId?: string;
  options: ComboboxOptionRenderer[];
  onQueryChange: (query: string) => void;
}

export const Combobox = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
  onQueryChange,
}: Props): JSX.Element => {
  const onItemSelected = (val: string) => {
    const event = { target: { value: val } };
    onChange(event);
  };

  return (
    <HUICombobox
      as="div"
      id={id || 'combobox'}
      className="relative w-full"
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      data-testid={testId}
    >
      {({ open }) => (
        <>
          <HUICombobox.Input
            onChange={(event) => onQueryChange(event.target.value)}
            displayValue={() => ''}
            data-testid={`${testId}-input`}
            className="input-element relative h-full w-full"
          />
          <HUICombobox.Button
            className="absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-none"
            data-testid={`${testId}-button`}
          >
            {buttonContent}
            <MdSearch className="mr-1 ml-auto text-2xl text-tweaked-brand" />
            <i
              className={`icon-arrow text-tweaked-brand transition duration-150 ease-in-out ${
                open ? '-rotate-180' : 'rotate-0'
              }`}
              style={{ fontSize: 10 }}
            />
          </HUICombobox.Button>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <HUICombobox.Options
              static
              className="absolute left-0 z-10 w-full rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
            >
              {options.map((item) => (
                <HUICombobox.Option key={item.key} value={item.value} as="li">
                  {(optionProps) => {
                    const child = item.render(optionProps);

                    const classNames = `${
                      optionProps.active ? 'bg-background' : ''
                    } flex group text-left pr-2 py-2 focus:outline-none items-center`;

                    return (
                      <span className={classNames}>
                        <MdCheck
                          className={`mx-1 text-2xl ${
                            optionProps.selected ? 'text-black' : 'invisible'
                          }`}
                        />

                        {child}
                      </span>
                    );
                  }}
                </HUICombobox.Option>
              ))}
            </HUICombobox.Options>
          </Transition>
        </>
      )}
    </HUICombobox>
  );
};
