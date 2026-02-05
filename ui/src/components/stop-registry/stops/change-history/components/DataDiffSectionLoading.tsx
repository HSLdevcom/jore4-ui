import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { theme } from '../../../../../generated/theme';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';
import { SectionTitle } from './SectionTitle';

type DataDiffSectionLoadingProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
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
            section={t('stopChangeHistory.versionLoading')}
          />
        }
        testId="LoadingStopPlaceVersion"
      />

      <tr>
        <td className="p-5" colSpan={7}>
          <PulseLoader color={theme.colors.brand} size={14} />
        </td>
      </tr>
    </>
  );
};
