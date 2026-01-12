import { ReactNode } from 'react';
import { Combobox, ComboboxInputProps, ComboboxOptionItem } from './Combobox';

type SearchableDropdownProps<T> = ComboboxInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly query: string;
  readonly selectedItem: T | undefined;
  readonly onQueryChange: (query: string) => void;
  readonly mapToButtonContent: (displayedItem?: T) => ReactNode;
  readonly options: ReadonlyArray<ComboboxOptionItem>;
} & (
    | {
        readonly nullOptionContent: ReactNode;
        readonly onChange: (newValue: string | null) => void;
      }
    | {
        readonly nullOptionContent?: never;
        readonly onChange: (newValue: string) => void;
      }
  );

export const SearchableDropdown = <T,>({
  selectedItem,
  options,
  query,
  value,
  onChange,
  mapToButtonContent,
  nullOptionContent,
  onQueryChange: parentOnQueryChange,
  ...otherProps
}: SearchableDropdownProps<T>) => {
  const nullOption = nullOptionContent
    ? { value: 'null', content: nullOptionContent }
    : undefined;

  const onItemSelected = (newValue: string) => {
    parentOnQueryChange('');
    if (nullOptionContent) {
      onChange(newValue === 'null' ? null : newValue);
    } else {
      onChange(newValue);
    }
  };

  const onQueryChange = (str: string) => {
    parentOnQueryChange(str);
  };

  const onBlur = () => {
    parentOnQueryChange('');
  };

  // Add null option to options if dropdown is nullable
  const allOptions = [...(nullOption ? [nullOption] : []), ...options];

  return (
    <Combobox
      value={value ?? ''} // Replace undefined value with empty string to avoid error
      buttonContent={query === '' ? mapToButtonContent(selectedItem) : null}
      options={allOptions}
      onChange={onItemSelected}
      onQueryChange={onQueryChange}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
      onBlur={onBlur}
    />
  );
};
