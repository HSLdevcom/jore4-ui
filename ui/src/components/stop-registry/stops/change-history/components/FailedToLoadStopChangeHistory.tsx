import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../../../../uiComponents';

const testIds = {
  failedToLoad: 'StopChangeHistoryPage::FailedToLoad',
  retryButton: 'StopChangeHistoryPage::RetryButton',
};

type FailedToLoadStopChangeHistoryProps = {
  readonly refetch: () => void;
};

export const FailedToLoadStopChangeHistory: FC<
  FailedToLoadStopChangeHistoryProps
> = ({ refetch }) => {
  const { t } = useTranslation();

  return (
    <tr>
      <td className="border p-5" colSpan={7}>
        <div
          className="flex flex-col items-center justify-center"
          data-testid={testIds.failedToLoad}
        >
          <p>{t('changeHistory.failedToLoad')}</p>
          <SimpleButton
            className="mt-5"
            onClick={() => refetch()}
            testId={testIds.retryButton}
          >
            {t('changeHistory.tryAgainButton')}
          </SimpleButton>
        </div>
      </td>
    </tr>
  );
};
