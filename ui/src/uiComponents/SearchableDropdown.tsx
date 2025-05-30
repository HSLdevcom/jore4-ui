import {
  Combobox,
  ComboboxEvent,
  ComboboxInputProps,
  ComboboxOptionRenderer,
} from './Combobox';

type SearchableDropdownProps<T> = ComboboxInputProps & {
  readonly id?: string;
  readonly testId?: string;
  readonly query: string;
  readonly selectedItem: T | undefined;
  readonly onQueryChange: (query: string) => void;
  readonly mapToButtonContent: (displayedItem?: T) => React.ReactElement;
  readonly nullOptionRender?: () => React.ReactElement;
  readonly options: ReadonlyArray<ComboboxOptionRenderer>;
};

export const SearchableDropdown = <T extends ExplicitAny>({
  selectedItem,
  options,
  query,
  onChange,
  mapToButtonContent,
  nullOptionRender,
  onQueryChange: parentOnQueryChange,
  ...otherProps
}: SearchableDropdownProps<T>) => {
  const nullOption = nullOptionRender
    ? { key: 'none', value: null, render: nullOptionRender }
    : undefined;

  const onItemSelected = (e: ComboboxEvent) => {
    parentOnQueryChange('');
    onChange(e);
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
