import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimingPlaceForComboboxFragment } from '../../../generated/graphql';
import {
  ComboboxOptionItem,
  FormInputProps as ListboxInputProps,
  SearchableDropdown,
} from '../../../uiComponents';
import { useChooseTimingPlaceDropdown } from './utils/useChooseTimingPlaceDropdown';

type ChooseTimingPlaceDropdownProps = ListboxInputProps & {
  readonly testId?: string;
  readonly optionAmount?: number;
};

const mapToOption = (
  item: TimingPlaceForComboboxFragment,
): ComboboxOptionItem => ({
  value: item.timing_place_id,
  content: `${item.label} (${item.description?.fi_FI})`,
});

export const ChooseTimingPlaceDropdown: FC<ChooseTimingPlaceDropdownProps> = ({
  testId,
  value,
  onChange,
  onBlur,
  optionAmount,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  const { timingPlaces, selectedTimingPlace } = useChooseTimingPlaceDropdown(
    query,
    value,
  );

  const timingPlacesToMap = optionAmount
    ? timingPlaces.slice(0, optionAmount - 1)
    : timingPlaces;

  const options = timingPlacesToMap.map(mapToOption) ?? [];

  const mapToButtonContent = (
    displayedTimingPlace?: TimingPlaceForComboboxFragment,
  ) => {
    // If no timing place is selected, show "Choose timing place"
    return (
      <div className="w-full">
        {displayedTimingPlace
          ? `${displayedTimingPlace?.label} (${displayedTimingPlace?.description?.fi_FI})`
          : t('stops.chooseTimingPlace')}
      </div>
    );
  };

  return (
    <SearchableDropdown
      id="choose-timing-place-combobox"
      query={query}
      testId={testId}
      mapToButtonContent={mapToButtonContent}
      nullOptionContent={t('stops.noTimingPlace')}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onQueryChange={setQuery}
      selectedItem={selectedTimingPlace}
    />
  );
};
