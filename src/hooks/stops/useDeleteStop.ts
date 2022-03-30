import { useTranslation } from 'react-i18next';
import {
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  JourneyPatternJourneyPattern,
  RemoveStopMutationVariables,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useRemoveStopMutation,
} from '../../generated/graphql';
import { mapGetStopWithRouteGraphDataByIdResult } from '../../graphql';
import {
  EditRouteTerminalStopsError,
  removeFromApolloCache,
  showDangerToast,
  showDangerToastWithError,
} from '../../utils';
import { useAsyncQuery } from '../useAsyncQuery';
import {
  getRoutesOfJourneyPatterns,
  isStartingOrEndingStopOfAnyRoute,
} from './utils';

interface DeleteParams {
  stopId: UUID;
}

export interface DeleteChanges extends DeleteParams {
  deletedStop: ServicePatternScheduledStopPoint;
  deleteStopFromRoutes: RouteRoute[];
  deleteStopFromJourneyPatterns: JourneyPatternJourneyPattern[];
}

export const useDeleteStop = () => {
  const { t } = useTranslation();
  const [removeStopMutation] = useRemoveStopMutation();
  const [getStopWithRouteGraphData] = useAsyncQuery<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >(GetStopWithRouteGraphDataByIdDocument);

  // find all journey patterns from which this stop will be removed
  const getJourneyPatternsToDeleteStopFrom = (
    stopWithRouteGraphData?: ServicePatternScheduledStopPoint,
  ) => {
    if (!stopWithRouteGraphData) {
      return [];
    }

    return stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns.map(
      (item) => item.journey_pattern,
    );
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareDelete = async ({ stopId }: DeleteParams) => {
    // check if we tried to delete the starting or ending stop of an existing route
    const stopRoutesResult = await getStopWithRouteGraphData({
      stop_id: stopId,
    });

    const stopWithRouteGraphData =
      // we know that the stop exists on the backend
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      mapGetStopWithRouteGraphDataByIdResult(stopRoutesResult)!;

    // TODO: show which routes' terminus stop this is
    if (isStartingOrEndingStopOfAnyRoute(stopId, stopWithRouteGraphData)) {
      throw new EditRouteTerminalStopsError(
        'Cannot delete the starting and ending stops of a route',
      );
    }

    // if the stop was part of a journey pattern, remove it from there too
    const deleteStopFromJourneyPatterns = getJourneyPatternsToDeleteStopFrom(
      stopWithRouteGraphData,
    );
    const deleteStopFromRoutes = getRoutesOfJourneyPatterns(
      deleteStopFromJourneyPatterns,
    );

    const changes: DeleteChanges = {
      stopId,
      deletedStop: stopWithRouteGraphData,
      deleteStopFromRoutes,
      deleteStopFromJourneyPatterns,
    };

    return changes;
  };

  const mapDeleteChangesToVariables = (changes: DeleteChanges) => {
    const variables: RemoveStopMutationVariables = {
      stop_id: changes.stopId,
    };
    return variables;
  };

  const removeStop = (variables: RemoveStopMutationVariables) => {
    removeStopMutation({
      variables,
      // remove stop from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: variables.stop_id,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
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

  return {
    prepareDelete,
    mapDeleteChangesToVariables,
    removeStop,
    defaultErrorHandler,
  };
};
