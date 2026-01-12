import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, FocusEventHandler, Fragment, ReactNode } from 'react';
import { Noop } from 'react-hook-form';
import { MdCheck } from 'react-icons/md';
import { twJoin } from 'tailwind-merge';
import { JoreComboboxButton, comboboxStyles } from './headlessHelpers';
import { dropdownTransition } from './JoreListbox';
import { ListboxOptionItem } from './JoreListboxOptions';

export const testIds = {
  input: (testId: string) => `${testId}::input`,
  button: (testId: string) => `${testId}::button`,
};

export type ComboboxInputProps = {
  readonly value?: string;
  readonly onChange: (newValue: string) => void;
  readonly onBlur?: Noop;
};

export type ComboboxOptionItem = ListboxOptionItem<string>;

type JoreComboboxProps = ComboboxInputProps & {
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly testId?: string;
  readonly options: ReadonlyArray<ComboboxOptionItem>;
  readonly onQueryChange: (query: string) => void;
  readonly nullable?: boolean;
};

export const JoreCombobox: FC<JoreComboboxProps> = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur: onBlurParent,
  onQueryChange,
}) => {
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
      className={comboboxStyles.root('w-full')}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      data-testid={testId}
    >
      {({ open }) => (
        <>
          <HUICombobox.Input
            onChange={(event) => onQueryChange(event.target.value)}
            displayValue={() => ''}
            data-testid={testId ? testIds.input(testId) : undefined}
            className={comboboxStyles.input()}
          />

          <JoreComboboxButton
            className="w-full"
            testId={testId ? testIds.button(testId) : undefined}
          >
            {buttonContent}
          </JoreComboboxButton>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <HUICombobox.Options
              as="div"
              static
              className={comboboxStyles.options()}
            >
              {options.map((item) => (
                <HUICombobox.Option
                  as="div"
                  className={comboboxStyles.option()}
                  key={item.value}
                  value={item.value}
                >
                  {(optionProps) => (
                    <>
                      <MdCheck
                        className={twJoin(
                          'mx-1 text-2xl',
                          optionProps.selected ? 'text-black' : 'invisible',
                        )}
                      />

                      {'content' in item
                        ? item.content
                        : item.render(optionProps)}
                    </>
                  )}
                </HUICombobox.Option>
              ))}
            </HUICombobox.Options>
          </Transition>
        </>
      )}
    </HUICombobox>
  );
};
