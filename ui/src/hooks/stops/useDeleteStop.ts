import { useTranslation } from 'react-i18next';
import { useDeleteQuay } from '../../components/stop-registry/stops/queries/useDeleteQuay';
import {
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  useGetStopWithRouteGraphDataByIdLazyQuery,
  useRemoveStopMutation,
} from '../../generated/graphql';
import { mapStopResultToStop } from '../../graphql';
import {
  EditRouteTerminalStopsError,
  InternalError,
  removeFromApolloCache,
  showDangerToast,
  showDangerToastWithError,
} from '../../utils';
import { getRoutesOfJourneyPatterns } from './utils';

type DeleteParams = {
  readonly stopPointId: UUID;
  readonly stopPlaceId: string;
  readonly quayId: string;
};

export type DeleteChanges = DeleteParams & {
  readonly deletedStopPoint: ServicePatternScheduledStopPoint;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

// Find all journey patterns from which this stop will be removed
function getJourneyPatternsToDeleteStopFrom(
  stopWithRouteGraphData?: ServicePatternScheduledStopPoint,
) {
  if (!stopWithRouteGraphData) {
    return [];
  }

  return stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns.map(
    (item) => item.journey_pattern,
  );
}

// Prepare variables for mutation and validate if it's even allowed.
// Try to produce a changeset that can be displayed on an explanatory UI.
function usePrepareDelete() {
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdLazyQuery();

  return async (deleteParams: DeleteParams) => {
    const { stopPointId } = deleteParams;

    // Check if we tried to delete the starting or ending stop of an existing route.
    const stopWithRoutesResult = await getStopWithRouteGraphData({
      variables: { stopId: stopPointId },
    });
    const stopWithRouteGraphData = mapStopResultToStop(stopWithRoutesResult);

    if (!stopWithRouteGraphData) {
      throw new InternalError(
        `Could not find Scheduled Stop Point with id ${stopPointId}`,
      );
    }

    // If the stop was part of a journey pattern, remove it from there too.
    const deleteStopFromJourneyPatterns = getJourneyPatternsToDeleteStopFrom(
      stopWithRouteGraphData,
    );
    const deleteStopFromRoutes = getRoutesOfJourneyPatterns(
      deleteStopFromJourneyPatterns,
    );

    const changes: DeleteChanges = {
      ...deleteParams,
      deletedStopPoint: stopWithRouteGraphData,
      deleteStopFromRoutes,
    };

    return changes;
  };
}

export const useDeleteStop = () => {
  const { t } = useTranslation();

  const prepareDelete = usePrepareDelete();
  const [removeStopMutation] = useRemoveStopMutation();
  const deleteQuay = useDeleteQuay();

  const removeStop = async ({
    stopPointId,
    stopPlaceId,
    quayId,
  }: DeleteChanges) => {
    const removedStopPointResult = await removeStopMutation({
      variables: { stop_id: stopPointId },
      // remove stop from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: stopPointId,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });

    const removedQuayResult = await deleteQuay(stopPlaceId, quayId);

    return { removedStopPointResult, removedQuayResult };
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t('stops.cannotEditTerminalStops'));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return { prepareDelete, removeStop, defaultErrorHandler };
};
