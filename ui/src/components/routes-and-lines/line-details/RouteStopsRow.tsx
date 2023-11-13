import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdHistory } from 'react-icons/md';
import { RouteStopFieldsFragment } from '../../../generated/graphql';
import { useAlertsAndHighLights, useAppDispatch } from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import { openTimingSettingsModalAction } from '../../../redux';
import {
  MAX_DATE,
  MIN_DATE,
  mapToShortDate,
  mapToShortDateTime,
} from '../../../time';
import { IconButton } from '../../../uiComponents';
import { HastusCode } from './HastusCode';
import { StopActionsDropdown } from './StopActionsDropdown';

const testIds = {
  container: (stopLabel: string) => `RouteStopsRow::${stopLabel}`,
  label: 'RouteStopsRow::label',
  name: 'RouteStopsRow::name',
  validityPeriod: 'RouteStopsRow::validityPeriod',
  lastEdited: 'RouteStopsRow::lastEdited',
  hastusCode: 'RouteStopsRow::hastusCode',
  openTimingSettingsButton: 'RouteStospRow::openTimingSettingsButton',
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
  const dispatch = useAppDispatch();

  // find the journey pattern instance that belongs to this route
  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (item) => item.journey_pattern.on_route_id === routeId,
    );

  // does the stop belong to this route's journey pattern?
  const stopBelongsToJourneyPattern = !!scheduledStopPointInJourneyPattern;

  // is the stop via point on this route's journey pattern?
  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;

  const isUsedAsTimingPoint =
    scheduledStopPointInJourneyPattern?.is_used_as_timing_point;

  const { getAlertLevel, getAlertStyle } = useAlertsAndHighLights();
  const alertStyle = getAlertStyle(getAlertLevel(stop));
  const hastusCode = stop.timing_place?.label;

  const journeyPatternId =
    scheduledStopPointInJourneyPattern?.journey_pattern_id;

  const scheduledStopPointSequence =
    scheduledStopPointInJourneyPattern?.scheduled_stop_point_sequence;

  const stopLabel = stop.label;

  const showTimingSettingsModal = () => {
    if (journeyPatternId && scheduledStopPointSequence !== undefined) {
      dispatch(
        openTimingSettingsModalAction({
          stopLabel,
          journeyPatternId,
          sequence: scheduledStopPointSequence,
        }),
      );
    }
  };
  // TODO: Rework table into basic elements
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
          <MdHistory className="ml-2 inline text-xl text-tweaked-brand" />
        </Row>
      </td>
      <td>
        <Row className="justify-center">
          {hastusCode ? (
            <HastusCode
              hastusCode={hastusCode}
              isUsedAsTimingPoint={isUsedAsTimingPoint}
              testId={testIds.hastusCode}
            />
          ) : (
            <IconButton
              testId={testIds.openTimingSettingsButton}
              icon={
                <AiFillPlusCircle
                  className={`ml-2 text-xl ${
                    stopBelongsToJourneyPattern ? 'text-brand' : 'text-gray-300'
                  }`}
                />
              }
              onClick={showTimingSettingsModal}
              disabled={!stopBelongsToJourneyPattern}
            />
          )}
        </Row>
      </td>
      <td>
        <StopActionsDropdown
          stopLabel={stopLabel}
          stopBelongsToJourneyPattern={stopBelongsToJourneyPattern}
          isViaPoint={isViaPoint}
          onAddToRoute={onAddToRoute}
          onRemoveFromRoute={onRemoveFromRoute}
          journeyPatternId={journeyPatternId}
          scheduledStopPointSequence={scheduledStopPointSequence}
        />
      </td>
    </tr>
  );
};
