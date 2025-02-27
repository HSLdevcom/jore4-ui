import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../../time';
import { StopAreaComponentProps } from '../types';

const testIds = {
  validityPeriod: 'StopAreaVersioningRow::validityPeriod',
};

export const StopAreaVersioningRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('flex items-center', className)}>
      <h2>{t('stopAreaDetails.title')}</h2>

      <div
        className="ml-4"
        title={t('accessibility:stops.validityPeriod')}
        data-testid={testIds.validityPeriod}
      >
        {mapToShortDate(area.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(area.validityEnd)}
      </div>
    </div>
  );
};
