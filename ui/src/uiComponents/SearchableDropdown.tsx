import {
  Combobox,
  ComboboxEvent,
  ComboboxInputProps,
  ComboboxOptionRenderer,
} from './Combobox';

interface Props<T> extends ComboboxInputProps {
  id?: string;
  testId?: string;
  query: string;
  selectedItem: T | undefined;
  onQueryChange: (query: string) => void;
  mapToButtonContent: (displayedItem?: T) => React.ReactElement;
  nullOptionRender?: () => React.ReactElement;
  options: ReadonlyArray<ComboboxOptionRenderer>;
}

export const SearchableDropdown = <T extends ExplicitAny>({
  selectedItem,
  options,
  query,
  onChange,
  mapToButtonContent,
  nullOptionRender,
  onQueryChange: parentOnQueryChange,
  ...otherProps
}: Props<T>): React.ReactElement => {
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
