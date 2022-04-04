import { useTranslation } from 'react-i18next';
import { FormInputProps, Listbox } from '../../uiComponents';

// It seems to be impossible to process enumerations in the way done here in a type safe way,
// at least without using 'as' in many places (which in itself isn't type safe). Therefore,
// this was implemented by processing the Enum values as strings.

export interface EnumDropdownProps extends FormInputProps {
  id?: string;
  values: string[];
  translationPrefix: string;
  placeholder: string;
}

export const EnumDropdown = ({
  id,
  value,
  onChange,
  onBlur,
  values,
  translationPrefix,
  placeholder,
}: EnumDropdownProps): JSX.Element => {
  const { t } = useTranslation();

  const translateEnum = (item: string) => t(`${translationPrefix}${item}`);

  const mapToOption = (item: string) => ({
    key: item,
    value: item,
    render: function EnumOption() {
      return (
        <div className="cursor-default">
          <div className="ml-2 mr-2">{translateEnum(item)}</div>
        </div>
      );
    },
  });

  const options = values.map((item) => mapToOption(item));

  return (
    <Listbox
      id={id || 'enum-dropdown'}
      buttonContent={value ? translateEnum(value) : placeholder}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
