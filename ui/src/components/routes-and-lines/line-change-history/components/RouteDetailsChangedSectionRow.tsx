import { FC } from 'react';
import { GetUserNameById } from '../../../../hooks';
import { ChangeValueSections } from '../../../common/ChangeHistory';
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

  const sectionTitle = <ItemTitle item={historyItem} />;

  return (
    <ChangeValueSections
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      noChangedValuesTitle={sectionTitle}
      noChangedValuesTitleClassName="bg-background"
      noChangedValuesTitleTestId="RouteDetails"
      current={currentRoute}
      previous={previousRoute}
      sections={[
        {
          diffVersions: diffRouteDetails,
          sectionTitle,
          sectionTitleClassName: 'bg-background',
          testId: 'RouteDetails',
        },
      ]}
    />
  );
};
