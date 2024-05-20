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

export interface NullableBooleanDropdownProps extends FormInputProps {
  id?: string;
  testId?: string;
  className?: string;
  translationKeys?: DropdownTranslationKeys;
  buttonClassNames?: string;
}

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
export const NullableBooleanDropdown = ({
  id,
  testId,
  value,
  translationKeys = defaultTranslationKeys,
  buttonClassNames = '',
  ...formInputProps
}: NullableBooleanDropdownProps): JSX.Element => {
  const { t } = useTranslation();
  const values = ['true', 'false', 'null'];

  const uiNameMapper = (val: string) => {
    if (val === 'true')
      return t(translationKeys.true || defaultTranslationKeys.true);
    if (val === 'false')
      return t(translationKeys.false || defaultTranslationKeys.false);
    if (val === 'null')
      return t(translationKeys.null || defaultTranslationKeys.null);
    return '?'; // Should never happen, right?
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
      testId={testId || testIds.dropdown}
      buttonContent={uiNameMapper(String(value ?? null))}
      options={options}
      value={value}
      buttonClassNames={buttonClassNames}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
