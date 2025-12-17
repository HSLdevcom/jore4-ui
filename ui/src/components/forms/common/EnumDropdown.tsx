import { ReactElement } from 'react';
import { FormInputProps, Listbox } from '../../../uiComponents';
import { AllOptionEnum, NullOptionEnum, getEnumValues } from '../../../utils';

const testIds = {
  enumDropdown: 'EnumDropdown::button',
};

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the Enum values as strings.

type EnumDropdownBaseProps<TEnum extends string> = FormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly className?: string;
  readonly buttonClassName?: string;
  readonly placeholder: string;
  readonly enumType: Readonly<Record<string, TEnum>>;
};

type EnumDropdownWithNullOptionProps = {
  readonly includeNullOption: true;
  readonly nullOptionText?: string;
};

type EnumDropdownWithoutNullOptionProps = {
  readonly includeNullOption?: never | false;
  readonly nullOptionText?: never;
};

type EnumDropdownWithPotentialAllOptionProps<TEnum extends string> = {
  readonly includeAllOption: boolean;
  readonly uiNameMapper: (key: TEnum | AllOptionEnum.All) => string;
};

type EnumDropdownWithoutAllOptionProps<TEnum extends string> = {
  readonly includeAllOption?: never;
  readonly uiNameMapper: (key: TEnum) => string;
};

export type EnumDropdownProps<TEnum extends string> =
  EnumDropdownBaseProps<TEnum> &
    (EnumDropdownWithNullOptionProps | EnumDropdownWithoutNullOptionProps) &
    (
      | EnumDropdownWithPotentialAllOptionProps<TEnum>
      | EnumDropdownWithoutAllOptionProps<TEnum>
    );

/**
 * Creates dropdown from enum values. This dropdown can be enrichted with 'All' option by giving
 * it the includeAllOption flag as true.
 */
export const EnumDropdown = <TEnum extends string>({
  id,
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  buttonClassName,
  includeAllOption,
  includeNullOption,
  ...formInputProps
}: EnumDropdownProps<TEnum>): ReactElement => {
  const values = getEnumValues({
    ...(includeAllOption ? { ...AllOptionEnum } : {}),
    ...enumType,
    ...(includeNullOption ? { ...NullOptionEnum } : {}),
  });

  const mapToOption = (item: string) => ({
    key: item,
    value: item,
    render: function EnumOption() {
      return (
        <div className="cursor-default">
          <div className="ml-2 mr-2">
            {uiNameMapper(item as unknown as TEnum)}
          </div>
        </div>
      );
    },
  });

  const options = values.map((item) => mapToOption(item));

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.enumDropdown}
      buttonContent={
        value ? uiNameMapper(value as unknown as TEnum) : placeholder
      }
      options={options}
      value={value}
      buttonClassNames={buttonClassName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
