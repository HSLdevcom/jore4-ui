import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../i18n';
import { FormInputProps, Listbox } from '../../../uiComponents';

const testIds = {
  dropdown: 'NullableBooleanDropdown::button',
};

interface DropdownTranslationKeys {
  true: TranslationKey;
  false: TranslationKey;
  null: TranslationKey;
}

export type NullableBooleanDropdownProps = FormInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly className?: string;
  readonly translationKeys?: DropdownTranslationKeys;
  readonly buttonClassName?: string;
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
  translationKeys = defaultTranslationKeys,
  buttonClassName = '',
  ...formInputProps
}) => {
  const { t } = useTranslation();
  const values = ['true', 'false', 'null'];

  const uiNameMapper = (val: string) => {
    switch (val) {
      case 'true':
        return t(translationKeys.true ?? defaultTranslationKeys.true);
      case 'false':
        return t(translationKeys.false ?? defaultTranslationKeys.false);
      case 'null':
        return t(translationKeys.null ?? defaultTranslationKeys.null);
      default:
        return '?'; // Should never happen, right?
    }
  };

  const mapToOption = (item: string) => ({
    key: item,
    value: item,
    render: function NullableBooleanOption() {
      return (
        <div className="cursor-default">
          <div className="ml-2 mr-2">{uiNameMapper(item)}</div>
        </div>
      );
    },
  });

  const options = values.map((item) => mapToOption(String(item)));

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={uiNameMapper(String(value ?? null))}
      options={options}
      value={value}
      buttonClassNames={buttonClassName}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
