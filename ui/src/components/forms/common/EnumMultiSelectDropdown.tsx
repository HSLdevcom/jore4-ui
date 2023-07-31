import first from 'lodash/first';
import isUndefined from 'lodash/isUndefined';
import { useTranslation } from 'react-i18next';
import { MultiSelectListbox } from '../../../uiComponents';
import { OptionRenderPropArg } from '../../../uiComponents/ListboxOptions';
import { AllOptionEnum, getEnumValues } from '../../../utils';
import { EnumDropdownProps } from './EnumDropdown';

const testIds = {
  enumDropdown: 'EnumDropdown::button',
};
// eslint-disable-next-line @typescript-eslint/ban-types
export const EnumMultiSelectDropdown = <TEnum extends Object>({
  id,
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  ...formInputProps
}: EnumDropdownProps<TEnum>): JSX.Element => {
  const { t } = useTranslation();

  // To handle array values in multi select component
  const mappedValue = value ? value.split(',') : [];

  const values = getEnumValues({ ...AllOptionEnum, ...enumType });

  const mapToOption = (item: string) => ({
    key: item,
    value: item,
    render: function EnumOption(optionRenderProps: OptionRenderPropArg) {
      return (
        <div className="cursor-default">
          <input
            type="checkbox"
            className="mr-2 h-5 w-6"
            checked={optionRenderProps.selected}
            readOnly
          />
          <div className="ml-1 mr-2">
            {uiNameMapper(item as unknown as TEnum)}
          </div>
        </div>
      );
    },
  });

  const getButtonContent = (inputValue?: string): string => {
    const enumValues = inputValue?.split(',');
    if (isUndefined(enumValues) || first(enumValues) === '') {
      return placeholder;
    }
    if (enumValues.length === values.length) {
      return uiNameMapper(AllOptionEnum.All as unknown as TEnum);
    }
    if (enumValues.length > 1) {
      return t('selected', { count: enumValues.length });
    }
    return uiNameMapper(enumValues[0] as unknown as TEnum);
  };

  const options = values.map((item) => mapToOption(item));
  return (
    <MultiSelectListbox
      id={id}
      testId={testId || testIds.enumDropdown}
      buttonContent={getButtonContent(value)}
      options={options}
      value={mappedValue}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
