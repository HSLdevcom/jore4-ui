import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { StopChangeHistoryItemSectionHeaderRow } from './StopChangeHistoryItemSectionHeaderRow';

type StopChangeHistoryItemSectionsProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
};

export const StopChangeHistoryItemSections: FC<
  StopChangeHistoryItemSectionsProps
> = ({ getUserNameById, historyItem }) => {
  const { t } = useTranslation();

  const versionInt = Number(historyItem.version);

  if (!Number.isSafeInteger(versionInt) || versionInt < 0) {
    return (
      <StopChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <h5>
            {t('stopChangeHistory.invalidVersion', {
              version: historyItem.version,
            })}
          </h5>
        }
      />
    );
  }

  if (versionInt === 1) {
    return (
      <StopChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={<h5>{t('stopChangeHistory.firstVersion')}</h5>}
      />
    );
  }

  return (
    <StopChangeHistoryItemSectionHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      sectionTitle={<h5>Muutokset tulee tänne</h5>}
    />
  );
};
