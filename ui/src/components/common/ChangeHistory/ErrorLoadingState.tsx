import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleButton } from '../../../uiComponents';

type ErrorLoadingStateProps = {
  readonly onRetry: () => void;
  readonly testIdPrefix?: string;
};

export const ErrorLoadingState: FC<ErrorLoadingStateProps> = ({
  onRetry,
  testIdPrefix = 'ErrorLoadingState',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-5 flex flex-col items-center justify-center"
      data-testid={`${testIdPrefix}::FailedToLoad`}
    >
      <p>{t('changeHistory.failedToLoad')}</p>
      <SimpleButton
        className="mt-5"
        onClick={onRetry}
        testId={`${testIdPrefix}::RetryButton`}
      >
        {t('changeHistory.tryAgainButton')}
      </SimpleButton>
    </div>
  );
};
