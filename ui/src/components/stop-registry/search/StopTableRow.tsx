import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StopSearchRow } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToShortDate } from '../../../time';

interface Props {
  className?: string;
  stop: StopSearchRow;
}

const testIds = {
  row: (label: string) => `StopTableRow::row::${label}`,
};

export const StopTableRow = ({ className = '', stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const yBorderClassNames = 'border-y border-y-light-grey';

  return (
    <tr
      className={`text-hsl-dark-80 ${className}`}
      data-testid={testIds.row(stop.label)}
    >
      {/* TODO: select column */}
      {/* TODO: alert style column */}
      <td className={`w-auto px-8 py-3 pr-20 ${yBorderClassNames}`}>
        <Row className="mb-2 items-center font-bold leading-none">
          <Link
            to={routeDetails[Path.stopDetails].getLink(
              stop.scheduled_stop_point_id,
            )}
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
      <td
        className={`w-full px-8 py-3 ${yBorderClassNames} align-top text-sm font-bold leading-6`}
      >
        <div className="border-l border-l-background pl-3">
          <Row>{stop.stop_place?.nameFin}</Row>
          <Row>{stop.stop_place?.nameSwe}</Row>
        </div>
      </td>
      <td
        className={`w-auto px-8 py-3 ${yBorderClassNames} whitespace-nowrap border-l border-l-background`}
      >
        <span title={t('accessibility:stops.validityPeriod')}>
          {mapToShortDate(stop.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(stop.validity_end)}
        </span>
      </td>
    </tr>
  );
};
