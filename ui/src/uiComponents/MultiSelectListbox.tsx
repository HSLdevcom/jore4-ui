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
}

interface Props extends MultiSelectFormInputProps {
  id?: string;
  buttonContent: ReactNode;
  testId?: string;
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
  buttonClassNames = '',
  arrowButtonClassNames = '',
}: Props): JSX.Element => {
  const onItemSelected = (val: string[]) => {
    let finalValue: string[] = [];

    const removed = first(
      Array.isArray(value) ? value.filter((x) => !val.includes(x)) : [],
    );
    const selected = first(val.filter((x) => !value?.includes(x)));

    if (selected === AllOptionEnum.All) {
      finalValue = options.map((option) => option.value);
    } else if (removed !== AllOptionEnum.All) {
      if (value?.length === options.length) {
        finalValue = val.filter((v) => v !== AllOptionEnum.All);
      } else if (val.length === options.length - 1) {
        finalValue = [...val, AllOptionEnum.All];
      } else {
        finalValue = val;
      }
    }
    onChange({ target: { value: finalValue.join(',') } });
  };

  const hasError = !!fieldState?.error;

  return (
    <HUIListbox
      id={id || 'multiSelectListbox'}
      as="div"
      className="relative"
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      multiple
    >
      {({ open }) => (
        <>
          <ListboxButton
            arrowButtonClassNames={arrowButtonClassNames}
            buttonClassNames={buttonClassNames}
            open={open}
            hasError={hasError}
            testId={testId}
            buttonContent={buttonContent}
          />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <ListboxOptions options={options} />
          </Transition>
        </>
      )}
    </HUIListbox>
  );
};
