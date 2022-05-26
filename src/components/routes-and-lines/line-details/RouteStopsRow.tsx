import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MdOutlineHistory } from 'react-icons/md';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import { useAppDispatch, useEditRouteJourneyPattern } from '../../../hooks';
import { Row, Visible } from '../../../layoutComponents';
import { openViaModal } from '../../../redux/slices/modals';
import {
  mapToShortDate,
  mapToShortDateTime,
  MAX_DATE,
  MIN_DATE,
} from '../../../time';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';

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
  const dispatch = useAppDispatch();
  const belongsToJourneyPattern = stopBelongsToJourneyPattern(stop, routeId);

  const {
    prepareDeleteStopFromRoute,
    mapDeleteStopFromRouteChangesToVariables,
    deleteStopFromRouteMutation,
  } = useEditRouteJourneyPattern();

  const deleteFromJourneyPattern = async () => {
    try {
      const changes = prepareDeleteStopFromRoute({
        routeId,
        stopPointId: stop.scheduled_stop_point_id,
      });
      const variables = mapDeleteStopFromRouteChangesToVariables(changes);

      await deleteStopFromRouteMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (point) =>
        point.scheduled_stop_point_id === stop.scheduled_stop_point_id &&
        point.journey_pattern.on_route_id === routeId,
    );

  const showViaModal = () => {
    const journeyPatternId =
      scheduledStopPointInJourneyPattern?.journey_pattern_id;

    if (journeyPatternId) {
      dispatch(
        openViaModal({
          scheduledStopPointId: stop.scheduled_stop_point_id,
          journeyPatternId,
        }),
      );
    }
  };

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
        <Visible visible={!!isViaPoint}>
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
        <SimpleDropdownMenu
          alignItems={AlignDirection.Left}
          testId="stop-row-action-menu"
        >
          {belongsToJourneyPattern ? (
            <button type="button" onClick={deleteFromJourneyPattern}>
              {t('stops.removeFromRoute')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAddToRoute(stop.scheduled_stop_point_id)}
            >
              {t('stops.addToRoute')}
            </button>
          )}
          {isViaPoint ? (
            <button type="button" onClick={showViaModal}>
              {t('viaModal.editViaPoint')}
            </button>
          ) : (
            <button
              disabled={!belongsToJourneyPattern}
              className={`${
                !belongsToJourneyPattern ? 'bg-background text-dark-grey' : ''
              }`}
              type="button"
              onClick={showViaModal}
            >
              {t('viaModal.createViaPoint')}
            </button>
          )}
        </SimpleDropdownMenu>
      </td>
    </tr>
  );
};
