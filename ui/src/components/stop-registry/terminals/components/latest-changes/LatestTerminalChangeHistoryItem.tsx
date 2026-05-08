import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { NoEarlierVersionExists } from '../../../../common/ChangeHistory';
import { PreviousStopPlaceChangeHistoryItem } from '../../../components/ChangeHistory';
import { LatestTerminalChangeDataDiff } from './LatestTerminalChangeDataDiff';

const testIds = {
  newItem: 'LatestTerminalChangeHistoryTable::Item::NewItem',
};

type LatestTerminalChangeHistoryItemProps = {
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly previousHistoryItem: PreviousStopPlaceChangeHistoryItem;
  readonly privateCode: string;
};

export const LatestTerminalChangeHistoryItem: FC<
  LatestTerminalChangeHistoryItemProps
> = ({ historyItem, previousHistoryItem, privateCode }) => {
  const { t } = useTranslation();

  if (previousHistoryItem === NoEarlierVersionExists) {
    return (
      <div className="mb-3 text-sm font-semibold" data-testid={testIds.newItem}>
        <Link
          to={routeDetails[Path.terminalChangeHistory].getLink(privateCode)}
          className="text-brand hover:underline"
        >
          {historyItem.privateCodeType === 'HSL/JORE-3'
            ? t(($) => $.terminalChangeHistory.importedTerminalVersion)
            : t(($) => $.terminalChangeHistory.newTerminalVersion)}
        </Link>
      </div>
    );
  }

  return (
    <LatestTerminalChangeDataDiff
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
      privateCode={privateCode}
    />
  );
};
