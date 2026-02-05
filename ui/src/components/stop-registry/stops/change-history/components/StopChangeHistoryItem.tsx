import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { DataDiffSections } from './DataDiffSections';

type StopChangeHistoryItemProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem | null;
};

export const StopChangeHistoryItem: FC<StopChangeHistoryItemProps> = ({
  getUserNameById,
  historyItem,
  previousHistoryItem,
}) => {
  const { t } = useTranslation();

  const versionInt = Number(historyItem.version);

  if (!Number.isSafeInteger(versionInt) || versionInt < 0) {
    return (
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <h5>
            {t('stopChangeHistory.invalidVersion', {
              version: historyItem.version,
            })}
          </h5>
        }
        testId="InvalidVersionNumber"
      />
    );
  }

  if (!previousHistoryItem) {
    return (
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <h5>
            {historyItem.privateCodeType === 'HSL/JORE-3'
              ? t('stopChangeHistory.importedVersion')
              : t('stopChangeHistory.firstVersion')}
          </h5>
        }
        testId={
          historyItem.privateCodeType === 'HSL/JORE-3'
            ? 'ImportedVersion'
            : 'FirstVersion'
        }
      />
    );
  }

  return (
    <DataDiffSections
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      previousHistoryItem={previousHistoryItem}
    />
  );
};
