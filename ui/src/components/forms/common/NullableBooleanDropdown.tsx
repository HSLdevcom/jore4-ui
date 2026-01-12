import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../i18n';
import {
  BaseFormInputProps,
  Listbox,
  ListboxOptionItem,
} from '../../../uiComponents';

const testIds = {
  dropdown: 'NullableBooleanDropdown::button',
};

const values = ['true', 'false', 'null'] as const;
type ValidStringValue = (typeof values)[number];

type DropdownTranslationKeys = {
  readonly true: TranslationKey;
  readonly false: TranslationKey;
  readonly null: TranslationKey;
};

export type NullableBooleanDropdownProps = BaseFormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly className?: string;
  readonly translationKeys?: DropdownTranslationKeys;
  readonly buttonClassName?: string;
  // Allow string in for compatability with old untyped use sites.
  readonly value?: boolean | null | ValidStringValue | string;
  readonly onChange: (newValue: boolean | null) => void;
};

const defaultTranslationKeys: DropdownTranslationKeys = {
  true: 'yes',
  false: 'no',
  null: 'unknown',
};

/**
 * Creates a dropdown with options for `true`, `false` and `null`.
 * Typically used with `nullableBoolean` custom zod schema.
 *
 * Note: value parameter typically comes in correct type (boolean|null),
 * but when selected from dropdown it is changed to string.
 */
export const NullableBooleanDropdown: FC<NullableBooleanDropdownProps> = ({
  id,
  testId,
  value,
  onChange,
  translationKeys = defaultTranslationKeys,
  buttonClassName,
  ...formInputProps
}) => {
  const { t } = useTranslation();

  const uiNameMapper = (val: ValidStringValue) => {
    switch (val) {
      case 'true':
        return t(translationKeys.true ?? defaultTranslationKeys.true);
      case 'false':
        return t(translationKeys.false ?? defaultTranslationKeys.false);
      default:
        return t(translationKeys.null ?? defaultTranslationKeys.null);
    }
  };

  const options: ReadonlyArray<ListboxOptionItem<ValidStringValue>> =
    values.map((item) => ({
      value: item,
      content: uiNameMapper(item),
    }));

  if (process.env.NODE_ENV === 'development') {
    const valueIsValid =
      value === undefined ||
      value === null ||
      typeof value === 'boolean' ||
      values.includes(value as ValidStringValue);

    if (!valueIsValid) {
      throw new TypeError(
        `Invalid value (${value}) passed into <NullableBooleanDropdown>! Supported values are: true, false, null, and their string variants ${values.join(', ')}`,
      );
    }
  }

  const mappedValue: ValidStringValue =
    typeof value === 'boolean' ? (String(value) as ValidStringValue) : 'null';

  const typeConvertingOnChange = (newValue: ValidStringValue) => {
    switch (newValue) {
      case 'true':
        return onChange(true);
      case 'false':
        return onChange(false);
      default:
        return onChange(null);
    }
  };

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={uiNameMapper(mappedValue)}
      options={options}
      value={mappedValue}
      buttonClassNames={buttonClassName}
      onChange={typeConvertingOnChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
