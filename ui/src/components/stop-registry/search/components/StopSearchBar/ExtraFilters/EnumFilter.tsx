import without from 'lodash/without';
import { FocusEventHandler, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationMapper } from '../../../../../../i18n/uiNameMappings';
import { AllOptionEnum, NullOptionEnum } from '../../../../../../utils';
import { MultiselectDropdownFilter } from './MultiselectDropdownFilter';
import {
  AugmentedOnChangeHandlerMetaData,
  useAugmentOnChangeHandlerWithMetaOptions,
} from './useAugmentOnChangeHandlerWithMetaOptions';

type EnumFilterProps<TEnum extends string> = {
  readonly className?: string;
  readonly defaultValue: ReadonlyArray<TEnum>;
  readonly disabled?: boolean;
  readonly id: string;
  readonly options: ReadonlyArray<TEnum>;
  readonly onBlur: FocusEventHandler<HTMLDivElement>;
  readonly onChange: (value: ReadonlyArray<TEnum>) => void;
  readonly testId: string;
  readonly uiNameMapper: TranslationMapper<TEnum>;
  readonly value: ReadonlyArray<TEnum>;
};

export const EnumFilter = <TEnum extends string>({
  className,
  defaultValue,
  disabled,
  id,
  options,
  onBlur,
  onChange,
  testId,
  uiNameMapper,
  value,
}: EnumFilterProps<TEnum>): ReactNode => {
  const { t } = useTranslation();

  const metaOptionInfo = useMemo<AugmentedOnChangeHandlerMetaData>(
    () => ({
      supportsAllMetaOption: options.includes(AllOptionEnum.All as TEnum),
      properOptionCount: without(
        options,
        AllOptionEnum.All as TEnum,
        NullOptionEnum.Null as TEnum,
      ).length,
    }),
    [options],
  );

  const onChangeHandler = useAugmentOnChangeHandlerWithMetaOptions({
    ...metaOptionInfo,
    onChange,
    defaultValue,
  });

  const formatOption = (option: TEnum) => uiNameMapper(t, option);
  const keyOption = (option: TEnum) => option;

  return (
    <MultiselectDropdownFilter
      className={className}
      disabled={disabled}
      formatOption={formatOption}
      id={id}
      keyOption={keyOption}
      options={options}
      onBlur={onBlur}
      onChange={onChangeHandler}
      testId={testId}
      value={value}
    />
  );
};
