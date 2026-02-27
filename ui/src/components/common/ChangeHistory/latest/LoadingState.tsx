import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type LoadingStateProps = {
  readonly testIdPrefix?: string;
};

export const LoadingState: FC<LoadingStateProps> = ({
  testIdPrefix = 'LoadingState',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-5 flex justify-center"
      data-testid={`${testIdPrefix}::Loading`}
    >
      <p>{t('changeHistory.loading')}</p>
    </div>
  );
};
