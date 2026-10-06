import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { AllOptionEnum, getEnumValues } from '../../../utils';
import { ValueFn } from '../Inputs';
import { EnumDropdownProps } from './EnumDropdown';
import { ListboxOptionItem } from './JoreListboxOptions';
import { MultiSelectListbox } from './MultiSelectListbox';

const testIds = {
  enumDropdown: 'EnumDropdown',
};

type EnumMultiSelectDropdownProps<TEnum extends string> = Omit<
  EnumDropdownProps<TEnum>,
  'value' | 'onChange'
> & {
  readonly value?: ReadonlyArray<TEnum>;
  readonly onChange: ValueFn;
};

export const EnumMultiSelectDropdown = <TEnum extends string>({
  id,
  testId,
  enumType,
  uiNameMapper,
  placeholder,
  value,
  ...formInputProps
}: EnumMultiSelectDropdownProps<TEnum>): ReactElement => {
  const { t } = useTranslation();

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

  const options = values.map((item) => mapToOption(item));

  const getButtonContent = (): string => {
    if (!value || value.length === 0) {
      return placeholder;
    }

    const typedAllOption = AllOptionEnum.All as unknown as TEnum;
    if (value.includes(typedAllOption)) {
      return uiNameMapper(typedAllOption);
    }

    return t(($) => $.selected, { count: value.length });
  };

  return (
    <MultiSelectListbox
      id={id}
      testId={testId ?? testIds.enumDropdown}
      buttonContent={getButtonContent()}
      options={options}
      value={value}
      {...formInputProps}
    />
  );
};
