import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { theme } from '../../../../generated/theme';
import { GetUserNameById } from '../../../../hooks';
import {
  BaseChangeHistoryItemDetails,
  ChangeHistoryItemSectionHeaderRow,
} from '../../../common/ChangeHistory';

type DataDiffSectionLoadingProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly sectionTitle: ReactNode;
  readonly headerTestId: string;
  readonly contentTestId?: string;
};

export const DataDiffSectionLoading: FC<DataDiffSectionLoadingProps> = ({
  getUserNameById,
  historyItem,
  sectionTitle,
  headerTestId,
  contentTestId = 'ChangeHistory::LoadingData::Content',
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ChangeHistoryItemSectionHeaderRow
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={sectionTitle}
        testId={headerTestId}
      />

      <tr>
        <td
          className="p-5"
          colSpan={7}
          data-testid={contentTestId}
          title={t(($) => $.changeHistory.versionLoading)}
        >
          <PulseLoader color={theme.colors.brand} size={14} />
        </td>
      </tr>
    </>
  );
};
