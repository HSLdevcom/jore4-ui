import { Field } from '@headlessui/react';
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
      <Field className="flex items-center">
        <SwitchLabel className="my-4 mr-4">
          {t('routes.showUnusedStops')}
        </SwitchLabel>
        <Switch
          checked={showUnusedStops}
          onChange={setShowUnusedStops}
          testId={testIds.showUnusedStopsSwitch}
        />
      </Field>
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
