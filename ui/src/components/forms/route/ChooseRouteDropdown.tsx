import debounce from 'lodash/debounce';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { useChooseRouteDropdown } from '../../../hooks';
import { MAX_DATE, MIN_DATE } from '../../../time';
import { Priority } from '../../../types/Priority';
import {
  Combobox,
  ComboboxEvent,
  ComboboxInputProps,
} from '../../../uiComponents';
import { DateRange } from '../common/DateRange';

const DEBOUNCE_DELAY_MS = 300;

interface Props extends ComboboxInputProps {
  testId?: string;
  date: DateTime;
  priorities: Priority[];
}

const mapToOptionContent = (item: RouteAllFieldsFragment) => (
  <div className="flex flex-col">
    <div>
      <span className="font-bold">{item.label}</span>
      {` | ${item.name_i18n?.fi_FI}`}
    </div>
    <div className="text-sm">
      <DateRange
        startDate={item.validity_start || MIN_DATE}
        endDate={item.validity_end || MAX_DATE}
      />
    </div>
  </div>
);

const mapToOption = (item: RouteAllFieldsFragment) => ({
  key: item.route_id,
  value: item.route_id,
  render: () => mapToOptionContent(item),
});

export const ChooseRouteDropdown = ({
  testId,
  value,
  onChange,
  onBlur,
  date,
  priorities,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  // Selected route details are shown on buttonContent by default
  // But we want to hide it when typing new search
  const [showButtonContent, setShowButtonContent] = useState(true);
  const { routes } = useChooseRouteDropdown({
    query,
    observationDate: date,
    priorities,
    routeId: value,
  });

  const options = routes?.map(mapToOption) || [];

  const selectedRoute = routes?.find((item) => item.route_id === value);

  const mapToButtonContent = (displayedRoute?: RouteAllFieldsFragment) => {
    // If no route is selected, show "Choose route"
    return (
      <div className="w-full">
        {displayedRoute
          ? `${displayedRoute.label} (${displayedRoute.name_i18n?.fi_FI})`
          : t('routes.chooseRoute')}
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
    onChange(e);
    setShowButtonContent(true);
  };

  return (
    <Combobox
      id="choose-route-combobox"
      testId={testId}
      buttonContent={
        showButtonContent ? mapToButtonContent(selectedRoute) : null
      }
      options={options}
      value={value}
      onChange={onItemSelected}
      onBlur={onBlur}
      onQueryChange={onQueryChange}
    />
  );
};
