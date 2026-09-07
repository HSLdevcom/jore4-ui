import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import {
  ChangeHistoryItemSectionHeaderRow,
  GetUserNameById,
  SectionTitle,
} from '../../../../common/ChangeHistory';

const testIds = {
  // These will expand to: ChangeHistory::SectionHeader::${testId}
  createdAreaVersion: 'CreatedAreaVersion',
  importedAreaVersion: 'ImportedAreaVersion',
};

type StopAreaChangeHistoryFirstVersionHeaderRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
};

export const StopAreaChangeHistoryFirstVersionHeaderRow: FC<
  StopAreaChangeHistoryFirstVersionHeaderRowProps
> = ({ getUserNameById, historyItem }) => {
  const { t } = useTranslation();

  if (historyItem.privateCodeType === 'HSL/JORE-3') {
    return (
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(($) => $.stopAreaChangeHistory.importedStopAreaVersion)}
          />
        }
        testId={testIds.importedAreaVersion}
      />
    );
  }

  return (
    <ChangeHistoryItemSectionHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      sectionTitle={
        <SectionTitle
          historyItem={historyItem}
          section={t(($) => $.stopAreaChangeHistory.newStopAreaVersion)}
        />
      }
      testId={testIds.createdAreaVersion}
    />
  );
};
