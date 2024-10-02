import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SlimSimpleButton } from '../../stops/stop-details/layout';

const testIds = {
  reason: 'StopSearchByLine::route::failedToLoadReason',
  refetch: 'StopSearchByLine::route::refetchStopsButton',
};

type LoadingStopsErrorRowProps = {
  readonly error: unknown;
  readonly refetch: () => void;
};

export const LoadingStopsErrorRow: FC<LoadingStopsErrorRowProps> = ({
  error,
  refetch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-light-grey p-8">
      <span data-testid={testIds.reason}>
        {t('stopRegistrySearch.failedToFetchStops', { reason: String(error) })}
      </span>
      <SlimSimpleButton data-testid={testIds.refetch} onClick={() => refetch()}>
        {t('stopRegistrySearch.tryToRefetch')}
      </SlimSimpleButton>
    </div>
  );
};
