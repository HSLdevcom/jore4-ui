import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../time';
import { StopRowTdProps } from '../types';

export const ValidityPeriodTd: FC<StopRowTdProps> = ({ className, stop }) => {
  const { t } = useTranslation();
  return (
    <td className={className}>
      <div
        className="flex flex-row whitespace-nowrap @max-3xl:flex-col"
        title={t(($) => $.accessibility.stops.validityPeriod)}
      >
        <span>{mapToShortDate(stop.validityStart)}</span>
        <span className="mx-1 @max-3xl:hidden">-</span>
        <span>{mapToShortDate(stop.validityEnd)}</span>
      </div>
    </td>
  );
};
