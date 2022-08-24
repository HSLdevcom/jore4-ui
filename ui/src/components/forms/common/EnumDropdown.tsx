import { FormInputProps, Listbox } from '../../../uiComponents';
import { getEnumValues } from '../../../utils';

const testIds = {
  enumDropdown: 'EnumDropdown::button',
};

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the Enum values as strings.

export interface EnumDropdownProps<TEnum> extends FormInputProps {
  testId?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  enumType: Object;
  uiNameMapper: (key: TEnum) => string;
  placeholder: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function EnumDropdown<TEnum extends Object>({
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  ...formInputProps
}: EnumDropdownProps<TEnum>) {
  const values = getEnumValues(enumType);

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
      testId={testId || testIds.enumDropdown}
      buttonContent={
        value ? uiNameMapper(value as unknown as TEnum) : placeholder
      }
      options={options}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
}
