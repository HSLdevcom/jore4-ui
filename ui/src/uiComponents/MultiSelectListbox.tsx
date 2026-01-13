import { Listbox } from '@headlessui/react';
import first from 'lodash/first';
import { FC, ReactNode } from 'react';
import { ControllerFieldState, Noop } from 'react-hook-form';
import { AllOptionEnum } from '../utils/enum';
import { JoreListboxButton, multiselectListboxStyles } from './headlessHelpers';
import { ValueFn } from './JoreListbox';
import { JoreListboxOptions, ListboxOptionItem } from './JoreListboxOptions';

type MultiSelectFormInputProps = {
  readonly value?: ReadonlyArray<string>;
  readonly onChange: ValueFn;
  readonly onBlur?: Noop;
  readonly fieldState?: ControllerFieldState;
  readonly disabled?: boolean;
};

type MultiSelectListboxProps = MultiSelectFormInputProps & {
  readonly id?: string;
  readonly buttonContent: ReactNode;
  readonly buttonClassNames?: string;
  readonly className?: string;
  readonly testId: string;
  readonly options: ReadonlyArray<ListboxOptionItem<string>>;
};

export const MultiSelectListbox: FC<MultiSelectListboxProps> = ({
  id,
  buttonContent,
  buttonClassNames,
  className,
  testId,
  options,
  value,
  onChange,
  onBlur,
  fieldState,
  disabled,
}) => {
  const getRemovedItem = (
    changedItems: ReadonlyArray<string>,
    items: ReadonlyArray<string> | undefined,
  ) => {
    return first(items?.filter((item) => !changedItems.includes(item))) ?? '';
  };

  const getAddedItem = (
    changedItems: ReadonlyArray<string>,
    items: ReadonlyArray<string> | undefined,
  ) => {
    return first(changedItems.filter((item) => !items?.includes(item))) ?? '';
  };

  const createUpdatedItems = (
    changedItems: ReadonlyArray<string>,
    items: ReadonlyArray<string> | undefined,
  ) => {
    const removed = getRemovedItem(changedItems, items);
    const selected = getAddedItem(changedItems, items);

    if (selected === AllOptionEnum.All) {
      return options.map((option) => option.value);
    }

    if (removed === AllOptionEnum.All) {
      return [];
    }

    // When every option is already selected
    // it is always deselect and AllOption is removed
    // because after deselect not all options are selected
    if (items?.length === options.length) {
      return changedItems.filter((v) => v !== AllOptionEnum.All);
    }

    // when everything except AllOption is selected
    // select also AllOption
    if (changedItems.length === options.length - 1) {
      return [...changedItems, AllOptionEnum.All];
    }

    return changedItems;
  };

  const onItemSelect = (changedItems: ReadonlyArray<string>) => {
    const updatedItems = createUpdatedItems(changedItems, value);
    const updatedItemsString = updatedItems.join(',');
    onChange({ target: { value: updatedItemsString } });
  };

  const hasError = !!fieldState?.error;

  return (
    <Listbox
      id={id ?? 'multiSelectListbox'}
      as="div"
      className={multiselectListboxStyles.root(className)}
      value={value}
      onChange={onItemSelect}
      onBlur={onBlur}
      multiple
      disabled={disabled}
    >
      <JoreListboxButton
        className={multiselectListboxStyles.button(buttonClassNames)}
        hasError={hasError}
        testId={`${testId}::ListboxButton`}
      >
        {buttonContent}
      </JoreListboxButton>

      <JoreListboxOptions
        className={multiselectListboxStyles.options()}
        optionClassName={multiselectListboxStyles.option()}
        options={options}
        testId={`${testId}::ListboxOptions`}
      />
    </Listbox>
  );
};
