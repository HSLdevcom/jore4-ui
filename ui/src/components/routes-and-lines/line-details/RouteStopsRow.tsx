import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { RouteStopFieldsFragment } from '../../../generated/graphql';
import { useAlertsAndHighLights } from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../../time';
import { StopActionsDropdown } from './StopActionsDropdown';

const testIds = {
  container: (stopLabel: string) => `RouteStopsRow::${stopLabel}`,
  label: 'RouteStopsRow::label',
  name: 'RouteStopsRow::name',
  validityPeriod: 'RouteStopsRow::validityPeriod',
  lastEdited: 'RouteStopsRow::lastEdited',
};

interface Props {
  className?: string;
  stop: RouteStopFieldsFragment;
  routeId: UUID;
  onAddToRoute: (stopLabel: string) => void;
  onRemoveFromRoute: (stopLabel: string) => void;
}

export const RouteStopsRow = ({
  className = '',
  stop,
  routeId,
  onAddToRoute,
  onRemoveFromRoute,
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
      data-testid={testIds.container(stop.label)}
    >
      <td
        className={`${alertStyle.listItemBorder || ''} p-4 pl-16 text-2xl`}
        data-testid={testIds.label}
      >
        {stop.label}
      </td>
      <td className="w-auto" data-testid={testIds.name}>
        <Row className="items-center">
          <span>!Pysäkki X</span>
          <Visible visible={isViaPoint}>
            <i className="icon-via text-4xl text-hsl-dark-green" />
          </Visible>
        </Row>
      </td>
      <td className="p-4" data-testid={testIds.validityPeriod}>
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
          <span data-testid={testIds.lastEdited}>
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
          onRemoveFromRoute={onRemoveFromRoute}
        />
      </td>
    </tr>
  );
};
