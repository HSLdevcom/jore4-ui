import { Switch as HuiSwitch } from '@headlessui/react';
import orderBy from 'lodash/orderBy';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithJpsAndStopsFragment } from '../../../generated/graphql';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { RouteStopsSection } from './RouteStopsSection';

interface Props {
  className?: string;
  routes: RouteWithInfrastructureLinksWithJpsAndStopsFragment[];
  testId?: string;
}

export const RouteStopsTable = ({ className = '', routes, testId }: Props) => {
  const { t } = useTranslation();
  const [showUnusedStops, setShowUnusedStops] = useState(false);
  const sortedRoutes = orderBy(routes, ['label', 'direction'], ['asc', 'desc']);

  return (
    <div>
      <div className="flex items-center">
        <HuiSwitch.Group>
          <SwitchLabel className="my-8 mr-8">
            {t('routes.showUnusedStops')}
          </SwitchLabel>
          <Switch
            checked={showUnusedStops}
            onChange={setShowUnusedStops}
            testId="show-unused-stops-switch"
          />
        </HuiSwitch.Group>
      </div>
      {/* setting a fake "height: 1px" so that "height: 100%" would work for the table cells */}
      <table className={`h-1 w-full ${className}`} data-testid={testId}>
        {sortedRoutes.map((item) => {
          return (
            <RouteStopsSection
              key={item.route_id}
              route={item}
              showUnusedStops={showUnusedStops}
            />
          );
        })}
      </table>
    </div>
  );
};
