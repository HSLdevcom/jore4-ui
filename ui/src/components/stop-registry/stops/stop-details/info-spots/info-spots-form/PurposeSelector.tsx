import { Listbox } from '@headlessui/react';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ListboxButton } from '../../../../../../uiComponents';
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
      className={twMerge('relative', className)}
      disabled={disabled}
      onChange={onChange}
      value={selectedItem}
      data-testid={testId}
    >
      <ListboxButton
        id={id}
        buttonContent={selectedItem.displayName}
        hasError={false}
        testId={`${testId}::ListboxButton`}
      />

      <Listbox.Options
        className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
        data-testid={`${testId}::ListboxOptions`}
      >
        {options.map((option, index) => (
          <Listbox.Option
            className="cursor-default border-b border-grey py-2 pl-4 pr-2 ui-active:bg-dark-grey ui-active:text-white"
            key={`${option.purposeType}-${option.customPurpose ?? index}`}
            value={option}
            data-testid={`${testId}::Option::${option.purposeType}`}
          >
            {option.displayName}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};
