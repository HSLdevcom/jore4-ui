import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Row } from '../../../../layoutComponents';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { StopRowTdProps } from './StopRowTdProps';

const testIds = {
  link: 'StopTableRow::link',
};

export const LabelAndTimingPlaceTd: FC<StopRowTdProps> = ({
  className,
  stop,
}) => {
  const { t } = useTranslation();
  return (
    <td className={className}>
      <Row className="mb-2 items-center font-bold leading-none">
        <Link
          to={routeDetails[Path.stopDetails].getLink(stop.label)}
          data-testid={testIds.link}
          title={t('accessibility:stops.showStopDetails', {
            stopLabel: stop.label,
          })}
        >
          <h2>{stop.label}</h2>
        </Link>
      </Row>
      <Row className="items-center">
        <span
          className="h-4 text-sm leading-none"
          title={t('accessibility:stops.timingPlace')}
        >
          {stop.timing_place?.label}
        </span>
      </Row>
    </td>
  );
};
