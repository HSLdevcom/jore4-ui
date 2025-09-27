import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../time';
import { StopRowTdProps } from '../types';

export const ValidityPeriodTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const { t } = useTranslation();
  return (
    <td className={className}>
      <span title={t('accessibility:stops.validityPeriod')}>
        {mapToShortDate(stop.validityStart)}
        <span className="mx-1">-</span>
        {mapToShortDate(stop.validityEnd)}
      </span>
    </td>
  );
};
