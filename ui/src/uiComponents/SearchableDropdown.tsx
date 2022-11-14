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
  options: ComboboxOptionRenderer[];
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
  onQueryChange: parentOnQueryChange,
}: Props<T>): JSX.Element {
  // Selected item details are shown on buttonContent by default
  // But we want to hide it when typing new search
  const [showButtonContent, setShowButtonContent] = useState(true);

  const debouncedSetQuery = debounce(
    (str) => parentOnQueryChange(str),
    DEBOUNCE_DELAY_MS,
  );

  const onQueryChange = (str: string) => {
    // If there is a searchword, do not show the buttonContent on top of input text
    if (str !== '') {
      setShowButtonContent(false);
    }
    debouncedSetQuery(str);
  };

  const onItemSelected = (e: ComboboxEvent) => {
    onChange(e);
    setShowButtonContent(true);
  };

  return (
    <Combobox
      id={id}
      testId={testId}
      buttonContent={
        showButtonContent ? mapToButtonContent(selectedItem) : null
      }
      options={options}
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      onQueryChange={onQueryChange}
    />
  );
}
