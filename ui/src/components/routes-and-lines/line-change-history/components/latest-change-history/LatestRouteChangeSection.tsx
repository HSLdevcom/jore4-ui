import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { LatestChangeHistoryItem } from '../../../../common/ChangeHistory/latest';
import { LineChangeHistoryItem, LineData } from '../../types';
import { diffRouteDetails } from '../../utils';
import { HistoricalRouteDirectionBadge } from '../HistoricalRouteDirectionBadge';

type LatestRouteChangeSectionProps = {
  readonly historyItem: LineChangeHistoryItem;
  readonly currentItemData: LineData;
  readonly previousItemData: LineData;
  readonly label: string;
};

export const LatestRouteChangeSection: FC<LatestRouteChangeSectionProps> = ({
  historyItem,
  currentItemData,
  previousItemData,
  label,
}) => {
  const { t } = useTranslation();

  const currentRoute = currentItemData.routes.find(
    (it) => it.route_id === historyItem.routeId,
  );
  const previousRoute = previousItemData.routes.find(
    (it) => it.route_id === historyItem.routeId,
  );

  if (!currentRoute || !previousRoute) {
    return null;
  }

  const title = (
    <Trans
      t={t}
      i18nKey={($) => $.lineChangeHistory.routeSectionTitle}
      components={{
        Direction: <HistoricalRouteDirectionBadge item={historyItem} />,
      }}
      values={{
        routeLabel: currentRoute.label,
        name: currentRoute.name_i18n.fi_FI,
      }}
    />
  ) as unknown as string;

  const sections = [
    {
      title,
      changes: diffRouteDetails(t, previousRoute, currentRoute),
    },
  ].filter((it) => it.changes.length > 0);

  return (
    <LatestChangeHistoryItem
      historyItem={historyItem}
      sections={sections}
      link={routeDetails[Path.lineChangeHistory].getLink(label)}
      testId="LatestLineChangeHistoryTable::Item::Diff"
    />
  );
};
