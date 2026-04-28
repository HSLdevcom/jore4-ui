import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { Priority } from '../../../../../types/enums';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { LatestStopChangeDataDiff } from './LatestStopChangeDataDiff';
import {
  determineType,
  getHeadingText,
} from './NoPreviousChangeVersionSection';

const testIds = {
  newItem: 'LatestStopChangeHistoryTable::Item::NewItem',
};

type LatestStopChangeHistoryItemProps = {
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem:
    | QuayChangeHistoryItem
    | typeof NoEarlierVersionExists;
  readonly publicCode: string;
  readonly priority: Priority;
};

export const LatestStopChangeHistoryItem: FC<
  LatestStopChangeHistoryItemProps
> = ({ historyItem, previousHistoryItem, publicCode, priority }) => {
  const { t } = useTranslation();

  const link = routeDetails[Path.stopChangeHistory].getLink(publicCode, {
    priority: priority === Priority.Standard ? undefined : priority,
  });

  if (previousHistoryItem === NoEarlierVersionExists) {
    const type = determineType(historyItem);
    const versionText = getHeadingText(t, type);
    return (
      <div className="mb-3 text-sm font-semibold" data-testid={testIds.newItem}>
        <Link to={link} className="text-brand hover:underline">
          {versionText}
        </Link>
      </div>
    );
  }

  return (
    <LatestStopChangeDataDiff
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
      priority={priority}
      publicCode={publicCode}
    />
  );
};
