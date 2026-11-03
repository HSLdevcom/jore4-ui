import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../utils/time';
import { StopRowTdProps } from '../types';

type ValidityPeriodTdProps = StopRowTdProps & {
  readonly validityPeriodContent?: ReactNode;
};

export const ValidityPeriodTd: FC<ValidityPeriodTdProps> = ({
  className,
  stop,
  validityPeriodContent,
}) => {
  const { t } = useTranslation();
  return (
    <td className={className}>
      {validityPeriodContent ?? (
        <div
          className="flex flex-row whitespace-nowrap @max-3xl:flex-col"
          title={t(($) => $.accessibility.stops.validityPeriod)}
        >
          <span>{mapToShortDate(stop.validityStart)}</span>
          <span className="mx-1 @max-3xl:hidden">-</span>
          <span>{mapToShortDate(stop.validityEnd)}</span>
        </div>
      )}
    </td>
  );
};
