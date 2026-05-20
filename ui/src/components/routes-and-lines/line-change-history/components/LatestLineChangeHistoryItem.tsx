import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { NoEarlierVersionExists } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem, PreviousLineChangeHistoryItem } from '../types';
import { HistoricalRouteDirectionBadge } from './HistoricalRouteDirectionBadge';
import { LatestLineChangeDataDiff } from './LatestLineChangeDataDiff';

const testIds = {
  newItem: 'LatestLineChangeHistoryTable::Item::NewItem',
};

type LatestLineChangeHistoryItemProps = {
  readonly historyItem: LineChangeHistoryItem;
  readonly previousHistoryItem: PreviousLineChangeHistoryItem;
  readonly label: string;
};

export const LatestLineChangeHistoryItem: FC<
  LatestLineChangeHistoryItemProps
> = ({ historyItem, previousHistoryItem, label }) => {
  const { t } = useTranslation();

  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <div className="mb-3 text-sm font-semibold" data-testid={testIds.newItem}>
        <Link
          to={routeDetails[Path.lineChangeHistory].getLink(label)}
          className="text-brand hover:underline"
        >
          {historyItem.routeId ? (
            <Trans
              t={t}
              i18nKey={($) => $.lineChangeHistory.newRouteVersion}
              components={{
                Direction: <HistoricalRouteDirectionBadge item={historyItem} />,
              }}
              values={historyItem}
            />
          ) : (
            t(($) => $.lineChangeHistory.newLineVersion, historyItem)
          )}
        </Link>
      </div>
    );
  }

  return (
    <LatestLineChangeDataDiff
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
      label={label}
    />
  );
};
