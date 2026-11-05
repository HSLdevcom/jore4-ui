import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../../../common/LayoutComponents';
import { StopRowTdProps } from '../types';
import { StopLabelLink } from './StopLabelLink';

type LabelAndTimingPlaceTdProps = StopRowTdProps & {
  readonly observationDate: Temporal.PlainDate;
};

export const LabelAndTimingPlaceTd: FC<LabelAndTimingPlaceTdProps> = ({
  className,
  observationDate,
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <td className={className}>
      <StopLabelLink observationDate={observationDate} stop={stop} />
      {stop.timingPlace && (
        <Row className="mt-2 items-center">
          <span
            className="h-4 text-sm leading-none"
            title={t(($) => $.accessibility.stops.timingPlace)}
          >
            {stop.timingPlace.label}
          </span>
        </Row>
      )}
    </td>
  );
};
