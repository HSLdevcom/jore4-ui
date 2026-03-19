import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { theme } from '../../../../generated/theme';
import { GetUserNameById } from '../../../../hooks';
import { ChangeHistoryItemSectionHeaderRow } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from '../types';
import { ItemTitle } from './ItemTitle';

type DataDiffSectionLoadingProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
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
        sectionTitle={<ItemTitle item={historyItem} />}
        testId="LoadingLineData"
      />

      <tr>
        <td
          className="p-5"
          colSpan={7}
          title={t('lineChangeHistory.versionLoading')}
        >
          <PulseLoader color={theme.colors.brand} size={14} />
        </td>
      </tr>
    </>
  );
};
