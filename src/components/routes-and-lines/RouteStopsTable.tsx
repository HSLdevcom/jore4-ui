import { Switch as HuiSwitch } from '@headlessui/react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteRoute } from '../../generated/graphql';
import { Switch, SwitchLabel } from '../../uiComponents';
import { RouteStopsSection } from './RouteStopsSection'; // eslint-disable-line import/no-cycle

interface Props {
  className?: string;
  routes: RouteRoute[];
  testId?: string;
}

export const RouteStopsTable = ({ className, routes, testId }: Props) => {
  const { t } = useTranslation();
  const [showUnusedStops, setShowUnusedStops] = useState(true);
  const sortedRoutes = orderBy(routes, ['label', 'direction'], ['asc', 'desc']);
  const groupedRoutes = groupBy(sortedRoutes, 'label');

  return (
    <div>
      <div className="flex items-center">
        <HuiSwitch.Group>
          <SwitchLabel className="my-8 mr-8">
            {t('routes.showUnusedStops')}
          </SwitchLabel>
          <Switch checked={showUnusedStops} onChange={setShowUnusedStops} />
        </HuiSwitch.Group>
      </div>
      {/* setting a fake "height: 1px" so that "height: 100%" would work for the table cells */}
      <table className={`h-1 w-full ${className}`} data-testid={testId}>
        {Object.values(groupedRoutes).map((routeDirections) => {
          return (
            <RouteStopsSection
              key={routeDirections[0].route_id}
              routeDirections={routeDirections}
              showUnusedStops={showUnusedStops}
            />
          );
        })}
      </table>
    </div>
  );
};
