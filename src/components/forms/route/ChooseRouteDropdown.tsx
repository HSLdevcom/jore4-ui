import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RouteRoute,
  useGetRouteDetailsByLabelWildcardQuery,
} from '../../../generated/graphql';
import { mapRoutesDetailsResult } from '../../../graphql';
import { MAX_DATE, MIN_DATE } from '../../../time';
import { Priority } from '../../../types/Priority';
import {
  Combobox,
  ComboboxEvent,
  ComboboxInputProps,
} from '../../../uiComponents';
import { mapToVariables, replaceStarCharacter } from '../../../utils';
import { DateRange } from '../common/DateRange';

interface Props extends ComboboxInputProps {
  testId?: string;
  date: DateTime;
  priorities: Priority[];
}

const mapToOptionContent = (item: RouteRoute) => (
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

const mapToOption = (item: RouteRoute) => ({
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

  const routesResult = useGetRouteDetailsByLabelWildcardQuery(
    mapToVariables({
      label: `${query}%`,
      date: date.toISO(),
      priorities,
    }),
  );

  const routes = mapRoutesDetailsResult(routesResult);

  const sortedRoutes = routes
    ?.slice()
    .sort((a, b) => (a.label > b.label ? 1 : -1));

  const options = sortedRoutes?.map(mapToOption) || [];

  const selectedRoute = routes?.find(
    (item) => item.route_id === value,
  ) as RouteRoute;

  // If no route is selected, show "Choose route"
  const mapToButtonContent = (displayedRoute?: RouteRoute) => {
    // Headless UI Combobox component takes care of displaying query
    if (query !== '') {
      return null;
    }

    return (
      <div className="w-full">
        {displayedRoute
          ? `${displayedRoute.label} (${displayedRoute.name_i18n?.fi_FI})`
          : t('routes.chooseRoute')}
      </div>
    );
  };

  const onSelect = (e: ComboboxEvent) => {
    setQuery('');
    onChange(e);
  };

  return (
    <Combobox
      id="choose-route-combobox"
      testId={testId}
      buttonContent={mapToButtonContent(selectedRoute)}
      options={options}
      value={value}
      onChange={onSelect}
      onBlur={onBlur}
      onQueryChange={(str) => setQuery(replaceStarCharacter(str))}
    />
  );
};
