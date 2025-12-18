import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { SimpleButton } from '../../../../uiComponents';

const testIds = {
  reason: 'StopSearch::GroupedStops::failedToLoadReason',
  refetch: 'StopSearch::GroupedStops::refetchStopsButton',
};

type LoadingStopsErrorRowProps = {
  readonly className?: string;
  readonly error: unknown;
  readonly refetch: () => void;
};

export const LoadingStopsErrorRow: FC<LoadingStopsErrorRowProps> = ({
  className,
  error,
  refetch,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center gap-4 border border-light-grey p-8',
        className,
      )}
    >
      <span data-testid={testIds.reason}>
        {t('stopRegistrySearch.failedToFetchStops', { reason: String(error) })}
      </span>
      <SimpleButton
        testId={testIds.refetch}
        shape="slim"
        onClick={() => refetch()}
      >
        {t('stopRegistrySearch.tryToRefetch')}
      </SimpleButton>
    </div>
  );
};
