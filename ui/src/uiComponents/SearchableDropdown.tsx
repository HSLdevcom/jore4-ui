import debounce from 'lodash/debounce';
import { useState } from 'react';
import {
  Combobox,
  ComboboxEvent,
  ComboboxInputProps,
  ComboboxOptionRenderer,
} from './Combobox';

const DEBOUNCE_DELAY_MS = 300;

interface Props<T> extends ComboboxInputProps {
  id?: string;
  testId?: string;
  selectedItem: T | undefined;
  onQueryChange: (query: string) => void;
  mapToButtonContent: (displayedItem?: T) => JSX.Element;
  nullOptionRender?: () => JSX.Element;
  options: ComboboxOptionRenderer[];
  nullable?: boolean;
}

export function SearchableDropdown<T>({
  id,
  testId,
  selectedItem,
  value,
  options,
  onChange,
  onBlur,
  mapToButtonContent,
  nullOptionRender = () => <></>,
  onQueryChange: parentOnQueryChange,
  nullable,
}: Props<T>): JSX.Element {
  // Query value is debounced because we do async call on query change.
  // We need to know the not debounced query value to determine what to show in the
  // combobox search input, therefore track with separate state variable whether or
  // not the query is empty.
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);

  const debouncedSetQuery = debounce(
    (str) => parentOnQueryChange(str),
    DEBOUNCE_DELAY_MS,
  );

  const onQueryChange = (str: string) => {
    setIsQueryEmpty(str === '');
    debouncedSetQuery(str);
  };

  const onItemSelected = (e: ComboboxEvent) => {
    onChange(e);
    // Query is reset on item selection
    setIsQueryEmpty(true);
  };

  const optionsWithNullOption =
    // Add null option to options if dropdown is nullable and if
    // no search word exists
    nullable && isQueryEmpty
      ? [
          {
            key: 'none',
            value: null,
            render: nullOptionRender,
          },
          ...options,
        ]
      : options;

  return (
    <Combobox
      id={id}
      testId={testId}
      buttonContent={isQueryEmpty ? mapToButtonContent(selectedItem) : null}
      options={optionsWithNullOption}
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      onQueryChange={onQueryChange}
      nullable={nullable}
    />
  );
}
