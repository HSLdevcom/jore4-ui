import first from 'lodash/first';
import isUndefined from 'lodash/isUndefined';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { ListboxOptionItem, MultiSelectListbox } from '../../../uiComponents';
import { AllOptionEnum, getEnumValues } from '../../../utils';
import { EnumDropdownProps } from './EnumDropdown';

const testIds = {
  enumDropdown: 'EnumDropdown',
};
export const EnumMultiSelectDropdown = <TEnum extends string>({
  id,
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  ...formInputProps
}: EnumDropdownProps<TEnum>): ReactElement => {
  const { t } = useTranslation();

  // To handle array values in multi select component
  const mappedValue = value ? value.split(',') : [];

  const values = [...getEnumValues(AllOptionEnum), ...getEnumValues(enumType)];

  const mapToOption = (item: string): ListboxOptionItem<TEnum> => ({
    value: item as TEnum,
    content: (
      <>
        <MdCheck className="mr-2 rounded-sm border border-grey text-2xl" />
        <span>{uiNameMapper(item as unknown as TEnum)}</span>
      </>
    ),
  });

  const getButtonContent = (inputValue?: string): string => {
    const enumValues = inputValue?.split(',');
    if (
      isUndefined(enumValues) ||
      (first(enumValues) === '' && !!enumValues.length)
    ) {
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
      testId={testId ?? testIds.enumDropdown}
      buttonContent={getButtonContent(value)}
      options={options}
      value={mappedValue}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
