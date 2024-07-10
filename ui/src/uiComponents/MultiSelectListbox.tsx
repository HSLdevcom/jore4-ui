import { Listbox as HUIListbox, Transition } from '@headlessui/react';
import first from 'lodash/first';
import { Fragment, ReactNode } from 'react';
import { ControllerFieldState, Noop } from 'react-hook-form';
import { AllOptionEnum } from '../utils/enum';
import { ValueFn, dropdownTransition } from './Listbox';
import { ListboxButton } from './ListboxButton';
import { ListboxOptionRenderer, ListboxOptions } from './ListboxOptions';

interface MultiSelectFormInputProps {
  value?: string[];
  onChange: ValueFn;
  onBlur?: Noop;
  fieldState?: ControllerFieldState;
  disabled?: boolean;
}

interface Props extends MultiSelectFormInputProps {
  id?: string;
  buttonContent: ReactNode;
  testId: string;
  options: ListboxOptionRenderer[];
  buttonClassNames?: string;
  arrowButtonClassNames?: string;
}

export const MultiSelectListbox = ({
  id,
  buttonContent,
  testId,
  options,
  value,
  onChange,
  onBlur,
  fieldState,
  disabled,
  buttonClassNames = '',
  arrowButtonClassNames = '',
}: Props): JSX.Element => {
  const getRemovedItem = (
    changedItems: string[],
    items: string[] | undefined,
  ) => {
    return first(items?.filter((item) => !changedItems.includes(item))) ?? '';
  };

  const getAddedItem = (
    changedItems: string[],
    items: string[] | undefined,
  ) => {
    return first(changedItems.filter((item) => !items?.includes(item))) ?? '';
  };

  const createUpdatedItems = (
    changedItems: string[],
    items: string[] | undefined,
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

  const onItemSelect = (changedItems: string[]) => {
    const updatedItems = createUpdatedItems(changedItems, value);
    const updatedItemsString = updatedItems.join(',');
    onChange({ target: { value: updatedItemsString } });
  };

  const hasError = !!fieldState?.error;

  return (
    <HUIListbox
      id={id ?? 'multiSelectListbox'}
      as="div"
      className="relative"
      value={value}
      onChange={onItemSelect}
      onBlur={onBlur}
      multiple
      disabled={disabled}
    >
      {({ open }) => (
        <>
          <ListboxButton
            arrowButtonClassNames={arrowButtonClassNames}
            buttonClassNames={buttonClassNames}
            open={open}
            hasError={hasError}
            testId={`${testId}::ListboxButton`}
            buttonContent={buttonContent}
            disabled={disabled}
          />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <ListboxOptions
              options={options}
              testId={`${testId}::ListboxOptions`}
            />
          </Transition>
        </>
      )}
    </HUIListbox>
  );
};
