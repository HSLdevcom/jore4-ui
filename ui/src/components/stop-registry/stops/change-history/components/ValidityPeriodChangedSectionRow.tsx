import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { SectionTitle } from './SectionTitle';

type ValidityPeriodChangedSectionRowProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
  readonly previousHistoryItem: QuayChangeHistoryItem;
};

export const ValidityPeriodChangedSectionRow: FC<
  ValidityPeriodChangedSectionRowProps
> = ({ getUserNameById, historyItem, previousHistoryItem }) => {
  const { t } = useTranslation();

  const validityStartChanged =
    previousHistoryItem.validityStart !== historyItem.validityStart;
  const validityEndChanged =
    previousHistoryItem.validityEnd !== historyItem.validityEnd;

  if (!validityStartChanged && !validityEndChanged) {
    return null;
  }

  return (
    <ChangeHistoryItemSectionHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      sectionTitle={
        <SectionTitle
          historyItem={historyItem}
          section={t('stopChangeHistory.validityPeriodTitle')}
        />
      }
      testId="ValidityPeriod"
    />
  );
};
