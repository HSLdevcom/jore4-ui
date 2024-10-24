import { FormInputProps, Listbox } from '../../../uiComponents';
import { AllOptionEnum, NullOptionEnum, getEnumValues } from '../../../utils';

const testIds = {
  enumDropdown: 'EnumDropdown::button',
};

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the Enum values as strings.

export interface EnumDropdownProps<TEnum> extends FormInputProps {
  id?: string;
  testId?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  enumType: Object;
  uiNameMapper: (key: TEnum) => string;
  placeholder: string;
  buttonClassName?: string;
  includeAllOption?: boolean;
  includeNullOption?: boolean;
  nullOptionText?: string;
}

/**
 * Creates dropdown from enum values. This dropdown can be enrichted with 'All' option by giving
 * it the includeAllOption flag as true.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const EnumDropdown = <TEnum extends Object>({
  id,
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  buttonClassName = '',
  includeAllOption,
  includeNullOption,
  ...formInputProps
}: EnumDropdownProps<TEnum>): React.ReactElement => {
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
