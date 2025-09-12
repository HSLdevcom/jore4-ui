import { Listbox, Transition } from '@headlessui/react';
import without from 'lodash/without';
import {
  FocusEventHandler,
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { twJoin, twMerge } from 'tailwind-merge';
import { TranslationMapper } from '../../../../../../i18n/uiNameMappings';
import { dropdownTransition } from '../../../../../../uiComponents';
import { AllOptionEnum, NullOptionEnum } from '../../../../../../utils';

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

  const { supportsAllMetaOption, properOptionCount } = useMemo(
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

  const onChangeHandler = useCallback(
    (newSelection: Array<TEnum>) => {
      // If empty → Reselect default options
      if (newSelection.length === 0) {
        return onChange(defaultValue);
      }

      const newSelectioWithoutMetaOptions = without(
        newSelection,
        AllOptionEnum.All as TEnum,
        NullOptionEnum.Null as TEnum,
      );

      const lastSelected = newSelection[newSelection.length - 1];
      const allSelected =
        (supportsAllMetaOption && lastSelected === AllOptionEnum.All) ||
        newSelectioWithoutMetaOptions.length === properOptionCount;

      if (allSelected) {
        return onChange([AllOptionEnum.All as TEnum]);
        // If Null was just selected (last item) → [Null]
      }

      if (lastSelected === NullOptionEnum.Null) {
        return onChange([NullOptionEnum.Null as TEnum]);
      }

      return onChange(newSelectioWithoutMetaOptions);
    },
    [onChange, defaultValue, supportsAllMetaOption, properOptionCount],
  );

  return (
    <Listbox
      as="div"
      className={twMerge('relative', className)}
      data-testid={testId}
      disabled={disabled}
      multiple
      onChange={onChangeHandler}
      onBlur={onBlur}
      value={value as Array<TEnum>}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            id={id}
            className={twJoin(
              'flex h-[var(--input-height)] w-full items-center justify-between rounded-md border border-grey bg-white px-2 py-3 text-left',
              'ui-disabled:bg-background ui-disabled:text-dark-grey',
              'ui-open:rounded-b-none ui-open:border-b-0 ui-open:pb-[calc(0.75rem+1px)]',
            )}
            data-testid={`${testId}::button`}
          >
            <span>
              {value.length > 1
                ? t('selected', { count: value.length })
                : uiNameMapper(t, value[0])}
            </span>
            <i
              className="icon-arrow rotate-0 text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180"
              style={{ fontSize: 10 }}
            />
          </Listbox.Button>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Listbox.Options
              as="div"
              static
              className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
            >
              {options.map((option) => (
                <Listbox.Option
                  className="group flex cursor-pointer items-center py-2 pr-2 text-left focus:outline-none ui-active:bg-background [&_svg]:ui-not-selected:invisible"
                  as="div"
                  key={option}
                  value={option}
                  data-testid={`${testId}::Option::${option}`}
                >
                  <MdCheck className="mx-1 rounded border border-grey text-2xl text-black" />
                  <span> {uiNameMapper(t, option)}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};
