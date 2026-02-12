import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { DataDiffSections } from './DataDiffSections';
import { NoPreviousChangeVersionSection } from './NoPreviousChangeVersionSection';

const testIds = {
  // These will expand to: ChangeHistory::SectionHeader::${testId}
  invalidVersion: 'InvalidVersion',
  importedVersion: 'ImportedVersion',
  createdVersion: 'CreatedVersion',
};

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
        testId={testIds.invalidVersion}
      />
    );
  }

  if (!previousHistoryItem) {
    return (
      <NoPreviousChangeVersionSection
        getUserNameById={getUserNameById}
        historyItem={historyItem}
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
