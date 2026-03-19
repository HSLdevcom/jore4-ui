import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { ChangedValuesWithHeaderRow } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, LineData } from '../types';
import { diffRouteDetails } from '../utils';
import { ItemTitle } from './ItemTitle';

type RouteDetailsChangedSectionRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
  readonly current: LineData;
  readonly previous: LineData;
};

export const RouteDetailsChangedSectionRow: FC<
  RouteDetailsChangedSectionRowProps
> = ({ getUserNameById, historyItem, current, previous }) => {
  const { routeId } = historyItem;
  const currentRoute = current.routes.find((it) => it.route_id === routeId);
  const previousRoute = previous.routes.find((it) => it.route_id === routeId);

  // Should never happen
  if (!currentRoute || !previousRoute) {
    return null;
  }

  return (
    <ChangedValuesWithHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      diffVersions={diffRouteDetails}
      current={currentRoute}
      previous={previousRoute}
      testId="RouteDetails"
      sectionTitle={<ItemTitle item={historyItem} />}
      sectionTitleClassName="bg-background"
    />
  );
};
