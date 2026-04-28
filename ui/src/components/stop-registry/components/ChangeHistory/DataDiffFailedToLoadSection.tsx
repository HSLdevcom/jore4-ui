import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GetUserNameById } from '../../../../hooks';
import { SimpleButton } from '../../../../uiComponents';
import {
  BaseChangeHistoryItemDetails,
  ChangeHistoryItemSectionHeaderRow,
} from '../../../common/ChangeHistory';

type DataDiffFailedToLoadSectionProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: BaseChangeHistoryItemDetails;
  readonly refetch: () => void;
  readonly sectionTitle: ReactNode;
  readonly headerTestId: string;
  readonly retryButtonTestId: string;
};

export const DataDiffFailedToLoadSection: FC<
  DataDiffFailedToLoadSectionProps
> = ({
  getUserNameById,
  historyItem,
  refetch,
  sectionTitle,
  headerTestId,
  retryButtonTestId,
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
        <td className="p-5" colSpan={7}>
          {t(($) => $.changeHistory.failedToLoad)}
        </td>
      </tr>

      <tr>
        <td className="p-5" colSpan={7}>
          <SimpleButton
            shape="slim"
            inverted
            onClick={refetch}
            testId={retryButtonTestId}
          >
            {t(($) => $.changeHistory.tryAgainButton)}
          </SimpleButton>
        </td>
      </tr>
    </>
  );
};
