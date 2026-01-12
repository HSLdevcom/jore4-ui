import { Listbox, Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';
import {
  JoreListboxButton,
  dropdownTransition,
  listboxStyles,
} from '../../../../../../uiComponents';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';

export type PurposeOption = {
  readonly purposeType: InfoSpotPurposeEnum;
  readonly customPurpose: string | null;
  readonly displayName: string;
};

type PurposeSelectorProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly onChange: (selectedPurpose: PurposeOption) => void;
  readonly options: ReadonlyArray<PurposeOption>;
  readonly selectedItem: PurposeOption;
  readonly testId: string;
};

export const PurposeSelector: FC<PurposeSelectorProps> = ({
  className,
  disabled = false,
  id,
  onChange,
  options,
  selectedItem,
  testId,
}) => {
  return (
    <Listbox
      as="div"
      className={listboxStyles.root(className)}
      disabled={disabled}
      onChange={onChange}
      value={selectedItem}
      data-testid={testId}
    >
      {({ open }) => (
        <>
          <JoreListboxButton id={id} testId={`${testId}::ListboxButton`}>
            {selectedItem.displayName}
          </JoreListboxButton>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Listbox.Options
              className={listboxStyles.options()}
              data-testid={`${testId}::ListboxOptions`}
            >
              {options.map((option, index) => (
                <Listbox.Option
                  className={listboxStyles.option()}
                  key={`${option.purposeType}-${option.customPurpose ?? index}`}
                  value={option}
                  data-testid={`${testId}::Option::${option.purposeType}`}
                >
                  {option.displayName}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};
