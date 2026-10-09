import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineForComboboxFragment } from '../../../../../../generated/graphql';
import { selectEditedRouteData, useAppSelector } from '../../../../../../redux';
import { MAX_DATE, MIN_DATE } from '../../../../../../time';
import {
  ComboboxInputProps,
  ComboboxOptionItem,
  SearchableDropdown,
} from '../../../../../common/Dropdowns';
import { DateRange } from '../../../../../common/Forms';
import { useChooseLineDropdown } from './useChooseLineDropdown';

type ChooseLineDropdownProps = ComboboxInputProps & {
  readonly testId?: string;
  readonly onLineSelected?: (line: LineForComboboxFragment | undefined) => void;
};

function mapToOption(item: LineForComboboxFragment): ComboboxOptionItem {
  return {
    value: item.line_id,
    content: (
      <div>
        <span>{`${item.label} (${item.name_i18n.fi_FI})`}</span>
        <div className="text-sm">
          <DateRange
            startDate={item.validity_start ?? MIN_DATE}
            endDate={item.validity_end ?? MAX_DATE}
          />
        </div>
      </div>
    ),
  };
}

export const ChooseLineDropdown: FC<ChooseLineDropdownProps> = ({
  testId,
  value,
  onChange,
  onBlur,
  onLineSelected,
}) => {
  const { t } = useTranslation();
  const { vehicleMode } = useAppSelector(selectEditedRouteData);

  const [query, setQuery] = useState('');

  const { lines, selectedLine } = useChooseLineDropdown(
    query,
    value,
    vehicleMode,
  );

  // Hand the resolved line (incl. its validity) up to the form so dependent
  // checks can read it without re-fetching.
  useEffect(() => {
    onLineSelected?.(selectedLine);
  }, [onLineSelected, selectedLine]);

  const options = lines?.map(mapToOption) ?? [];

  const mapToButtonContent = (displayedLine?: LineForComboboxFragment) => {
    // If no line is selected, show "Choose line"
    return (
      <div className="w-full">
        {displayedLine
          ? `${displayedLine?.label} (${displayedLine?.name_i18n.fi_FI})`
          : t(($) => $.routes.onLineId)}
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
