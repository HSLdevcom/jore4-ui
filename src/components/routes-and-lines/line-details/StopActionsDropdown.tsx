import { useTranslation } from 'react-i18next';
import { ServicePatternScheduledStopPoint } from '../../../generated/graphql';
import { useAppDispatch, useEditRouteJourneyPattern } from '../../../hooks';
import { openViaModalAction } from '../../../redux';
import { AlignDirection, SimpleDropdownMenu } from '../../../uiComponents';
import { showDangerToast, showSuccessToast } from '../../../utils';

interface Props {
  stop: ServicePatternScheduledStopPoint;
  routeId: UUID;
  onAddToRoute: (stopLabel: string) => void;
}

export const StopActionsDropdown = ({
  stop,
  routeId,
  onAddToRoute,
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

  const {
    prepareDeleteStopFromRoute,
    mapDeleteStopFromRouteChangesToVariables,
    deleteStopFromRouteMutation,
  } = useEditRouteJourneyPattern();

  const deleteFromJourneyPattern = async () => {
    try {
      const changes = prepareDeleteStopFromRoute({
        routeId,
        stopPointLabel: stop.label,
      });
      const variables = mapDeleteStopFromRouteChangesToVariables(changes);

      await deleteStopFromRouteMutation(variables);
      showSuccessToast(t('routes.saveSuccess'));
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
    }
  };

  const showViaModal = () => {
    const journeyPatternId =
      scheduledStopPointInJourneyPattern?.journey_pattern_id;

    if (journeyPatternId) {
      dispatch(
        openViaModalAction({
          stopLabel: stop.label,
          journeyPatternId,
        }),
      );
    }
  };

  return (
    <SimpleDropdownMenu
      alignItems={AlignDirection.Left}
      testId="stop-row-action-menu"
    >
      {stopBelongsToJourneyPattern ? (
        <button type="button" onClick={deleteFromJourneyPattern}>
          {t('stops.removeFromRoute')}
        </button>
      ) : (
        <button type="button" onClick={() => onAddToRoute(stop.label)}>
          {t('stops.addToRoute')}
        </button>
      )}
      {isViaPoint ? (
        <button type="button" onClick={showViaModal}>
          {t('viaModal.editViaPoint')}
        </button>
      ) : (
        <button
          disabled={!stopBelongsToJourneyPattern}
          className={`${
            !stopBelongsToJourneyPattern ? 'bg-background text-dark-grey' : ''
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
