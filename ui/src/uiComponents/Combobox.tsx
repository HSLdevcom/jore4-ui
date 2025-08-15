import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, FocusEventHandler, Fragment, ReactNode } from 'react';
import { Noop } from 'react-hook-form';
import { MdCheck, MdSearch } from 'react-icons/md';
import { dropdownTransition } from './Listbox';
import { OptionRenderPropArg } from './ListboxOptions';

export const testIds = {
  input: (testId: string) => `${testId}::input`,
  button: (testId: string) => `${testId}::button`,
};

export type ComboboxInputProps = {
  readonly value?: string;
  readonly onChange: (e: ComboboxEvent) => void;
  readonly onBlur?: Noop;
};

export type ComboboxOptionRenderer = {
  readonly key: string;
  readonly value: string | null;
  readonly render: (props: OptionRenderPropArg) => ReactNode;
};

type ComboboxProps = ComboboxInputProps & {
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly testId?: string;
  readonly options: ReadonlyArray<ComboboxOptionRenderer>;
  readonly onQueryChange: (query: string) => void;
  readonly nullable?: boolean;
};

export type ComboboxEvent = {
  target: {
    value: string;
  };
};

export const Combobox: FC<ComboboxProps> = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur: onBlurParent,
  onQueryChange,
}) => {
  const onItemSelected = (val: string) => {
    const event: ComboboxEvent = { target: { value: val } };
    onChange(event);
  };

  /**
   * HUI Combobox is somewhat weirdly implemented and clicking an option inside the combobox
   * will trigger onBlur event which will cause a flickering inside the texts that are shown
   * in the combobox. This is why we want to prevent the default when selecting item from the
   * options. Only if we really focus out (click outside the combobox) we want to trigger
   * onBlur event.
   */
  const onBlur: FocusEventHandler = (e) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.role === 'option') {
      e.preventDefault();
    } else if (onBlurParent) {
      onBlurParent();
    }
  };

  return (
    <HUICombobox
      as="div"
      id={id ?? 'combobox'}
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
            data-testid={testId ? testIds.input(testId) : undefined}
            className="relative h-full w-full rounded-md border border-grey bg-white px-2 py-3"
          />
          <HUICombobox.Button
            className="absolute inset-y-0 right-0 flex h-full w-full items-center justify-end px-3 text-left focus:outline-none"
            data-testid={testId ? testIds.button(testId) : undefined}
          >
            {buttonContent}
            <MdSearch className="ml-auto mr-1 text-2xl text-tweaked-brand" />
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
              as="div"
              static
              className="absolute left-0 z-10 w-full rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
            >
              {options.map((item) => (
                <HUICombobox.Option as="div" key={item.key} value={item.value}>
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
