import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { GetUserNameById } from '../../../../../hooks';
import {
  ChangeHistoryItemSectionHeaderRow,
  SectionTitle,
} from '../../../../common/ChangeHistory';

const testIds = {
  // These will expand to: ChangeHistory::SectionHeader::${testId}
  createdTerminalVersion: 'CreatedTerminalVersion',
  importedTerminalVersion: 'ImportedTerminalVersion',
};

type TerminalChangeHistoryFirstVersionHeaderRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
};

export const TerminalChangeHistoryFirstVersionHeaderRow: FC<
  TerminalChangeHistoryFirstVersionHeaderRowProps
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
            section={t(($) => $.terminalChangeHistory.importedTerminalVersion)}
          />
        }
        testId={testIds.importedTerminalVersion}
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
          section={t(($) => $.terminalChangeHistory.newTerminalVersion)}
        />
      }
      testId={testIds.createdTerminalVersion}
    />
  );
};
