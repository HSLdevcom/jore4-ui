import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { StopPlaceChangeHistoryItem } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { GetUserNameById } from '../../../hooks';
import { ChangeHistoryItemSectionHeaderRow } from './ChangeHistoryItemSectionHeaderRow';
import { SectionTitle } from './SectionTitle';

const testIds = {
  // Expands to ChangeHistory::SectionHeader::LoadingStopAreaData
  sectionTitle: 'LoadingStopAreaData',
  contentCell: "ChangeHistory::LoadingStopAreaData::Content'",
};

type DataDiffSectionLoadingProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
  readonly sectionTitle: ReactNode;
};

export const DataDiffSectionLoading: FC<DataDiffSectionLoadingProps> = ({
  getUserNameById,
  historyItem,
  sectionTitle,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle historyItem={historyItem} section={sectionTitle} />
        }
        testId={testIds.sectionTitle}
      />

      <tr>
        <td
          className="p-5"
          colSpan={7}
          data-testid={testIds.contentCell}
          title={t(($) => $.changeHistory.versionLoading)}
        >
          <PulseLoader color={theme.colors.brand} size={14} />
        </td>
      </tr>
    </>
  );
};
