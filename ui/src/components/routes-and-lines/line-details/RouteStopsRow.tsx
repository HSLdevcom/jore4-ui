import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { useAlertsAndHighLights } from '../../../hooks';
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
  onAddToRoute: (stopLabel: string) => void;
  onDeleteFromRoute: (stopLabel: string) => void;
}

export const RouteStopsRow = ({
  className = '',
  stop,
  routeId,
  onAddToRoute,
  onDeleteFromRoute,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  // find the journey pattern instance that belongs to this route
  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (item) => item.journey_pattern.on_route_id === routeId,
    );

  // does the stop belong to this route's journey pattern?
  const stopBelongsToJourneyPattern = !!scheduledStopPointInJourneyPattern;

  // is the stop via point on this route's journey pattern?
  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(stop));

  return (
    <tr
      className={`border border-l-8 ${
        stopBelongsToJourneyPattern ? '' : 'bg-background text-dark-grey'
      } ${className}`}
    >
      <td
        className={`${alertStyle.listItemBorder || ''} p-4 pl-16 text-3xl`}
        data-testid="stop-row-label"
      >
        {stop.label}
      </td>
      <td className="w-auto" data-testid="stop-row-name">
        <Row className="items-center">
          <span>!Pysäkki X</span>
          <Visible visible={isViaPoint}>
            <i className="icon-via text-4xl text-hsl-dark-green" />
          </Visible>
        </Row>
      </td>
      <td className="p-4" data-testid="stop-row-validity-period">
        <Row className="items-center justify-end">
          {stopBelongsToJourneyPattern
            ? t('validity.validDuring', {
                startDate: mapToShortDate(stop.validity_start || MIN_DATE),
                endDate: mapToShortDate(stop.validity_end || MAX_DATE),
              })
            : t('stops.notPartOfRoute')}
          {alertStyle.icon && (
            <i className={`${alertStyle.icon} ml-2 text-3xl`} />
          )}
        </Row>
      </td>
      <td className="p-4">
        <Row className="items-center justify-end">
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
          onDeleteFromRoute={onDeleteFromRoute}
        />
      </td>
    </tr>
  );
};
