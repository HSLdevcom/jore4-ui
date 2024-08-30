import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../time';
import { StopRowTdProps } from './StopRowTdProps';

export const ValidityPeriodTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const { t } = useTranslation();
  return (
    <td className={className}>
      <span title={t('accessibility:stops.validityPeriod')}>
        {mapToShortDate(stop.validity_start)}
        <span className="mx-1">-</span>
        {mapToShortDate(stop.validity_end)}
      </span>
    </td>
  );
};
