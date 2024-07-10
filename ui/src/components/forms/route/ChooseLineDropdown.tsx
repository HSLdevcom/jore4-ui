import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineForComboboxFragment } from '../../../generated/graphql';
import { useChooseLineDropdown } from '../../../hooks';
import { MAX_DATE, MIN_DATE } from '../../../time';
import { ComboboxInputProps, SearchableDropdown } from '../../../uiComponents';
import { DateRange } from '../common';

interface Props extends ComboboxInputProps {
  testId?: string;
}

const mapToOptionContent = (item: LineForComboboxFragment) => (
  <div>
    <span>{`${item.label} (${item.name_i18n.fi_FI})`}</span>
    <div className="text-sm">
      <DateRange
        startDate={item.validity_start ?? MIN_DATE}
        endDate={item.validity_end ?? MAX_DATE}
      />
    </div>
  </div>
);

const mapToOption = (item: LineForComboboxFragment) => ({
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

  const { lines, selectedLine } = useChooseLineDropdown(query, value);

  const options = lines?.map(mapToOption) ?? [];

  const mapToButtonContent = (displayedLine?: LineForComboboxFragment) => {
    // If no line is selected, show "Choose line"
    return (
      <div className="w-full">
        {displayedLine
          ? `${displayedLine?.label} (${displayedLine?.name_i18n.fi_FI})`
          : t('routes.onLineId')}
      </div>
    );
  };

  return (
    <SearchableDropdown
      id="choose-line-combobox"
      testId={testId}
      query={query}
      mapToButtonContent={mapToButtonContent}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onQueryChange={setQuery}
      selectedItem={selectedLine}
    />
  );
};
