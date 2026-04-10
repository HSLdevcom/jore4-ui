import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { StopPlaceChangeHistoryItem } from '../../../../../generated/graphql';
import { theme } from '../../../../../generated/theme';
import { GetUserNameById } from '../../../../../hooks';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { SectionTitle } from './SectionTitle';

const testIds = {
  // Expands to ChangeHistory::SectionHeader::LoadingStopAreaData
  sectionTitle: 'LoadingStopAreaData',
  contentCell: "ChangeHistory::LoadingStopAreaData::Content'",
};

type DataDiffSectionLoadingProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: StopPlaceChangeHistoryItem;
};

export const DataDiffSectionLoading: FC<DataDiffSectionLoadingProps> = ({
  getUserNameById,
  historyItem,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <SectionTitle
            historyItem={historyItem}
            section={t(
              ($) => $.stopAreaChangeHistory.sectionTitle,
              historyItem,
            )}
          />
        }
        testId={testIds.sectionTitle}
      />

      <tr>
        <td
          className="p-5"
          colSpan={7}
          data-testid={testIds.contentCell}
          title={t(($) => $.stopAreaChangeHistory.versionLoading)}
        >
          <PulseLoader color={theme.colors.brand} size={14} />
        </td>
      </tr>
    </>
  );
};
