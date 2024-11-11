import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import PulseLoader from 'react-spinners/PulseLoader';
import { theme } from '../../../../generated/theme';

const testIds = {
  loader: 'StopSearch::GroupedStops::loader',
};

export const LoadingStopsRow: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-column items-center justify-center border border-light-grey p-8">
      <PulseLoader
        data-testid={testIds.loader}
        color={theme.colors.brand}
        size={25}
        speedMultiplier={0.7}
      />

      <span className="mt-4">{t('search.searching')}</span>
    </div>
  );
};
