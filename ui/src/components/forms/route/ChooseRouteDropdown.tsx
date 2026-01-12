import { DateTime } from 'luxon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteAllFieldsFragment } from '../../../generated/graphql';
import { MAX_DATE, MIN_DATE } from '../../../time';
import { Priority } from '../../../types/enums';
import { ComboboxInputProps, SearchableDropdown } from '../../../uiComponents';
import { DateRange } from '../common/DateRange';
import { useChooseRouteDropdown } from './useChooseRouteDropdown';

type ChooseRouteDropdownProps = ComboboxInputProps & {
  readonly testId?: string;
  readonly date: DateTime;
  readonly priorities: ReadonlyArray<Priority>;
};

const mapToOption = (item: RouteAllFieldsFragment) => ({
  value: item.route_id,
  content: (
    <div>
      <div data-testid="label-and-name">
        <span className="font-bold">{item.label}</span>
        {` | ${item.name_i18n?.fi_FI}`}
      </div>
      <div className="text-sm">
        <DateRange
          startDate={item.validity_start ?? MIN_DATE}
          endDate={item.validity_end ?? MAX_DATE}
        />
      </div>
    </div>
  ),
});

export const ChooseRouteDropdown: FC<ChooseRouteDropdownProps> = ({
  testId,
  value,
  onChange,
  onBlur,
  date,
  priorities,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  const { routes, selectedRoute } = useChooseRouteDropdown({
    query,
    observationDate: date,
    priorities,
    routeId: value,
  });

  const options = routes?.map(mapToOption) ?? [];

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

  return (
    <SearchableDropdown
      id="choose-route-combobox"
      testId={testId}
      query={query}
      mapToButtonContent={mapToButtonContent}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onQueryChange={setQuery}
      selectedItem={selectedRoute}
    />
  );
};
