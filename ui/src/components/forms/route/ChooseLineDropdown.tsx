import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../../generated/graphql';
import { useChooseLineDropdown } from '../../../hooks';
import { MAX_DATE, MIN_DATE } from '../../../time';
import {
  Combobox,
  ComboboxEvent,
  FormInputProps as ListboxInputProps,
} from '../../../uiComponents';
import { DateRange } from '../common';

const DEBOUNCE_DELAY_MS = 300;

interface Props extends ListboxInputProps {
  testId?: string;
}

const mapToOptionContent = (item: RouteLine) => (
  <div>
    <span>{`${item.label} (${item.name_i18n.fi_FI})`}</span>
    <div className="text-sm">
      <DateRange
        startDate={item.validity_start || MIN_DATE}
        endDate={item.validity_end || MAX_DATE}
      />
    </div>
  </div>
);

const mapToOption = (item: RouteLine) => ({
  key: item.line_id,
  value: item.line_id,
  render: () => mapToOptionContent(item),
});

export const ChooseLineDropdown = ({
  testId,
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [showButtonContent, setShowButtonContent] = useState(true);

  const lines = useChooseLineDropdown(query);

  const options = lines?.map(mapToOption) || [];

  const selectedLine = lines?.find((item) => item.line_id === value);

  const mapToButtonContent = (displayedLine?: RouteLine) => {
    // If no line is selected, show "Choose line"
    return (
      <div className="w-full">
        {displayedLine
          ? `${displayedLine?.label} (${displayedLine?.name_i18n.fi_FI})`
          : t('routes.chooseLine')}
      </div>
    );
  };

  const debouncedSetQuery = debounce((str) => setQuery(str), DEBOUNCE_DELAY_MS);

  const onQueryChange = (str: string) => {
    // If there is a searchword, do not show the buttonContent on top of input text
    if (str !== '') {
      setShowButtonContent(false);
    }
    debouncedSetQuery(str);
  };

  const onItemSelected = (e: ComboboxEvent) => {
    setQuery('');
    onChange(e);
    setShowButtonContent(true);
  };

  return (
    <Combobox
      id="choose-line-combobox"
      testId={testId}
      buttonContent={
        showButtonContent ? mapToButtonContent(selectedLine) : null
      }
      options={options}
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      onQueryChange={onQueryChange}
    />
  );
};
