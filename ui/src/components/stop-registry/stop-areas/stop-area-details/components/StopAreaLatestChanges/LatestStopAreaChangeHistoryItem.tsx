import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { StopPlaceChangeHistoryItem } from '../../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../../router/routeDetails';
import {
  NoEarlierVersionExists,
  PreviousStopPlaceChangeHistoryItem,
} from '../../../../../common/ChangeHistory';
import { LatestStopAreaChangeDataDiff } from './LatestStopAreaChangeDataDiff';

const testIds = {
  newItem: 'LatestStopAreaChangeHistoryTable::Item::NewItem',
};

type LatestStopAreaChangeHistoryItemProps = {
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: PreviousStopPlaceChangeHistoryItem;
  readonly privateCode: string;
};

export const LatestStopAreaChangeHistoryItem: FC<
  LatestStopAreaChangeHistoryItemProps
> = ({ historyItem, previousHistoryItem, privateCode }) => {
  const { t } = useTranslation();

  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <div className="mb-3 text-sm font-semibold" data-testid={testIds.newItem}>
        <Link
          to={routeDetails[Path.stopAreaChangeHistory].getLink(privateCode)}
          className="text-brand hover:underline"
        >
          {historyItem.privateCodeType === 'HSL/JORE-3'
            ? t(($) => $.stopAreaChangeHistory.importedStopAreaVersion)
            : t(($) => $.stopAreaChangeHistory.newStopAreaVersion)}
        </Link>
      </div>
    );
  }

  return (
    <LatestStopAreaChangeDataDiff
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
      privateCode={privateCode}
    />
  );
};
