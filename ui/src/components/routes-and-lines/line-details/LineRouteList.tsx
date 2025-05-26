import { Switch as HuiSwitch } from '@headlessui/react';
import orderBy from 'lodash/orderBy';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteUniqueFieldsFragment } from '../../../generated/graphql';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { LineRouteListItem } from './LineRouteListItem';

type LineRouteListProps = {
  readonly routes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

const testIds = {
  showUnusedStopsSwitch: 'LineRouteList::showUnusedStopsSwitch',
};

export const LineRouteList: FC<LineRouteListProps> = ({ routes }) => {
  const { t } = useTranslation();
  const [showUnusedStops, setShowUnusedStops] = useState(false);
  const sortedRoutes = orderBy(routes, ['label', 'direction'], ['asc', 'desc']);

  return (
    <div>
      <div className="flex items-center">
        <HuiSwitch.Group>
          <SwitchLabel className="my-8 mr-4">
            {t('routes.showUnusedStops')}
          </SwitchLabel>
          <Switch
            checked={showUnusedStops}
            onChange={setShowUnusedStops}
            testId={testIds.showUnusedStopsSwitch}
          />
        </HuiSwitch.Group>
      </div>
      <ul>
        {sortedRoutes.map((item, index) => {
          return (
            <LineRouteListItem
              showUnusedStops={showUnusedStops}
              key={item.route_id}
              routeId={item.route_id}
              isLast={index === sortedRoutes.length - 1}
            />
          );
        })}
      </ul>
    </div>
  );
};
