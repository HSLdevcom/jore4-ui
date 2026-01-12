import { ReactElement, Ref, forwardRef } from 'react';
import {
  BaseFormInputProps,
  Listbox,
  ListboxOptionItem,
} from '../../../uiComponents';
import { AllOptionEnum, NullOptionEnum } from '../../../utils';

const testIds = {
  enumDropdown: 'EnumDropdown::button',
};

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the Enum values as strings.

type EnumDropdownBaseProps<TEnum extends string> = BaseFormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly className?: string;
  readonly buttonClassName?: string;
  readonly placeholder: string;
  readonly enumType: Readonly<Record<string, TEnum>>;
  // Allow string in for compatability with old untyped use sites.
  readonly value?: TEnum | string;
  readonly onChange: (newValue: TEnum) => void;
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
 * Creates dropdown from enum values. This dropdown can be enriched with 'All' option by giving
 * it the includeAllOption flag as true.
 */
const EnumDropdownImpl = <TEnum extends string>(
  {
    id,
    testId,
    enumType,
    uiNameMapper,
    placeholder,
    value,
    buttonClassName,
    includeAllOption = false,
    includeNullOption = false,
    ...formInputProps
  }: EnumDropdownProps<TEnum>,
  ref: Ref<HTMLDivElement>,
): ReactElement => {
  type AllPossibleValues = TEnum | AllOptionEnum | NullOptionEnum;
  const values: ReadonlyArray<AllPossibleValues> = [
    ...Object.values(includeAllOption ? AllOptionEnum : {}),
    ...Object.values(enumType),
    ...Object.values(includeNullOption ? NullOptionEnum : {}),
  ];

  if (process.env.NODE_ENV === 'development') {
    const valueIsValid =
      value === undefined ||
      (includeNullOption && value === null) ||
      values.includes(value as AllPossibleValues);

    if (!valueIsValid) {
      throw new TypeError(
        `Invalid value (${value}) passed into <EnumDropdown>! Supported values based on props are: ${values.map((v) => `'${v}'`).join(', ')}`,
      );
    }
  }

  const options: ReadonlyArray<ListboxOptionItem<TEnum>> = values.map(
    (item) => ({
      value: item as unknown as TEnum,
      content: uiNameMapper(item as unknown as TEnum),
    }),
  );

  const mappedValue = value === null ? 'null' : value;

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.enumDropdown}
      buttonContent={
        value ? uiNameMapper(mappedValue as unknown as TEnum) : placeholder
      }
      options={options}
      value={mappedValue as TEnum}
      buttonClassNames={buttonClassName}
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};

export const EnumDropdown = forwardRef(EnumDropdownImpl) as (<
  TEnum extends string,
>(
  p: EnumDropdownProps<TEnum> & { ref?: Ref<HTMLDivElement> },
) => ReactElement) & { displayName?: string };
EnumDropdown.displayName = 'EnumDropdown';
