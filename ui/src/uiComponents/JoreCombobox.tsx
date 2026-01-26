import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { Noop } from 'react-hook-form';
import { JoreComboboxButton, comboboxStyles } from './headlessHelpers';
import { ListboxOptionItem } from './JoreListboxOptions';

export const testIds = {
  input: (testId: string) => `${testId}::input`,
  button: (testId: string) => `${testId}::button`,
  option: (testId: string, key: string) => `${testId}::option::${key}`,
};

export type ComboboxInputProps = {
  readonly value?: string;
  readonly onChange: (newValue: string | null) => void;
  readonly onBlur?: Noop;
};

export type ComboboxOptionItem = ListboxOptionItem<string>;

type JoreComboboxProps = ComboboxInputProps & {
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly testId?: string;
  readonly options: ReadonlyArray<ComboboxOptionItem>;
  readonly onQueryChange: (query: string) => void;
};

export const JoreCombobox: FC<JoreComboboxProps> = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
  onQueryChange,
}) => {
  return (
    <Combobox
      as="div"
      id={id ?? 'combobox'}
      className={comboboxStyles.root('w-full')}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      data-testid={testId}
    >
      <ComboboxInput
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

      <ComboboxOptions
        anchor="bottom start"
        className={comboboxStyles.options()}
        transition
      >
        {options.map((item) => (
          <ComboboxOption
            className={comboboxStyles.option()}
            key={item.value}
            value={item.value}
            data-testid={
              testId ? testIds.option(testId, item.value) : undefined
            }
          >
            {(optionProps) => (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>{'content' in item ? item.content : item.render(optionProps)}</>
            )}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
};
