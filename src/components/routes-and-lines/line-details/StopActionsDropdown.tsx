import { useTranslation } from 'react-i18next';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { stopBelongsToJourneyPattern } from '../../../graphql';
import { useAppDispatch, useEditRouteJourneyPattern } from '../../../hooks';
import { openViaModalAction } from '../../../redux';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';

interface StopActionsDropdownProps {
  stop: ServicePatternScheduledStopPoint;
  routeId: UUID;
  onAddToRoute: (stopId: UUID) => void;
}

export const StopActionsDropdown = ({
  stop,
  routeId,
  onAddToRoute,
}: StopActionsDropdownProps): JSX.Element => {
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
        openViaModalAction({
          scheduledStopPointId: stop.scheduled_stop_point_id,
          journeyPatternId,
        }),
      );
    }
  };

  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;
  return (
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
  );
};
