import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import { Row, Visible } from '../../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../../time';
import { StopActionsDropdown } from './StopActionsDropdown';

interface Props {
  className?: string;
  stop: ServicePatternScheduledStopPoint;
  routeId: UUID;
  onAddToRoute: (stopId: UUID) => void;
}

export const RouteStopsRow = ({
  className,
  stop,
  routeId,
  onAddToRoute,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const belongsToJourneyPattern = stopBelongsToJourneyPattern(stop, routeId);

  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (point) =>
        point.scheduled_stop_point_id === stop.scheduled_stop_point_id &&
        point.journey_pattern.on_route_id === routeId,
    );

  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;

  return (
    <tr
      className={`border border-l-8 ${
        belongsToJourneyPattern ? '' : 'bg-background text-dark-grey'
      } ${className}`}
    >
      <td className="py-4 pl-16 pr-4" data-testid="stop-row-label">
        {stop.label}
      </td>
      <td data-testid="stop-row-name">
        <span>!Pysäkki X</span>
        <Visible visible={isViaPoint}>
          <i className="icon-via text-4xl text-hsl-dark-green" />
        </Visible>
      </td>

      <td className="pr-16 text-right" data-testid="stop-row-validity-period">
        {belongsToJourneyPattern
          ? t('validity.validDuring', {
              startDate: mapToShortDate(stop.validity_start || MIN_DATE),
              endDate: mapToShortDate(stop.validity_end || MAX_DATE),
            })
          : t('stops.notPartOfRoute')}
      </td>
      <td>
        <Row className="items-center">
          <span data-testid="stop-row-last-edited">
            !{mapToShortDateTime(DateTime.now())}
          </span>
          <MdOutlineHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td>&nbsp;</td>
      <td>
        <StopActionsDropdown
          routeId={routeId}
          stop={stop}
          onAddToRoute={onAddToRoute}
        />
      </td>
    </tr>
  );
};
