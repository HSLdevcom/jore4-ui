import { Listbox, ListboxOption, ListboxOptions } from '@headlessui/react';
import { FC } from 'react';
import {
  JoreListboxButton,
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
      <JoreListboxButton id={id} testId={`${testId}::ListboxButton`}>
        {selectedItem.displayName}
      </JoreListboxButton>

      <ListboxOptions
        anchor="bottom start"
        className={listboxStyles.options()}
        data-testid={`${testId}::ListboxOptions`}
        transition
      >
        {options.map((option, index) => (
          <ListboxOption
            className={listboxStyles.option()}
            key={`${option.purposeType}-${option.customPurpose ?? index}`}
            value={option}
            data-testid={`${testId}::Option::${option.purposeType}`}
          >
            {option.displayName}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
};
