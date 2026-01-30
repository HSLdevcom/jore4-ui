import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { useGetUserNames } from '../../../../../hooks';
import { StopChangeHistoryItem } from './StopChangeHistoryItem';

type StopChangeHistoryTableProps = {
  readonly className?: string;
  readonly historyItems: ReadonlyArray<QuayChangeHistoryItem>;
};

export const StopChangeHistoryTable: FC<StopChangeHistoryTableProps> = ({
  className,
  historyItems,
}) => {
  const { t } = useTranslation();

  const { getUserNameById } = useGetUserNames();

  return (
    <table className={className}>
      <thead>
        <tr className="border-b border-light-grey">
          <th className="pb-5">{null}</th>
          <th className="w-0 px-5 pb-5">
            {t('stopChangeHistory.tableHeaders.validityStart')}
          </th>
          <th className="w-0 px-5 pb-5">
            {t('stopChangeHistory.tableHeaders.validityEnd')}
          </th>
          <th className="w-0 px-5 pb-5">
            {t('stopChangeHistory.tableHeaders.changedBy')}
          </th>
          <th className="w-0 pb-5 pl-5">
            {t('stopChangeHistory.tableHeaders.changed')}
          </th>
        </tr>
      </thead>

      <tbody>
        {historyItems.map((historyItem) => (
          <StopChangeHistoryItem
            key={`${historyItem.netexId}-${historyItem.version}`}
            getUserNameById={getUserNameById}
            historyItem={historyItem}
          />
        ))}
      </tbody>
    </table>
  );
};
