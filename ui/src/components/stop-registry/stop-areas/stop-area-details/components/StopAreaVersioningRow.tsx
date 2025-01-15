import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../../time';
import { StopAreaComponentProps } from './StopAreaComponentProps';

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
        {mapToShortDate(area.stop_place?.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(area.stop_place?.validityEnd)}
      </div>
    </div>
  );
};
