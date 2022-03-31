import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  GetStopByIdDocument,
  GetStopByIdQuery,
  GetStopByIdQueryVariables,
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  JourneyPatternJourneyPattern,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useEditStopMutation,
} from '../../generated/graphql';
import {
  mapGetStopByIdResult,
  mapGetStopWithRouteGraphDataByIdResult,
  ScheduledStopPointSetInput,
} from '../../graphql';
import {
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  IncompatibleDirectionsError,
  LinkNotResolvedError,
  mapLngLatToPoint,
  showDangerToast,
} from '../../utils';
import { useAsyncQuery } from '../useAsyncQuery';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';
import {
  getRoutesOfJourneyPatterns,
  isStartingOrEndingStopOfAnyRoute,
} from './utils';

interface EditParams {
  stopId: UUID;
  patch: ScheduledStopPointSetInput;
}

export interface EditChanges {
  stopId: UUID;
  patch: ScheduledStopPointSetInput;
  editedStop: ServicePatternScheduledStopPoint;
  deleteStopFromRoutes: RouteRoute[];
  deleteStopFromJourneyPatterns: JourneyPatternJourneyPattern[];
}

export const isEditChanges = (
  input: Record<string, ExplicitAny>,
): input is EditChanges => {
  return !!input.editedStop;
};

export const useEditStop = () => {
  const { t } = useTranslation();
  const [editStopMutation] = useEditStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const [getStopWithRouteGraphData] = useAsyncQuery<
    GetStopWithRouteGraphDataByIdQuery,
    GetStopWithRouteGraphDataByIdQueryVariables
  >(GetStopWithRouteGraphDataByIdDocument);
  const [getStopById] = useAsyncQuery<
    GetStopByIdQuery,
    GetStopByIdQueryVariables
  >(GetStopByIdDocument);

  // find all route geometries from which this stop has been removed
  const getJourneyPatternsToDeleteStopFrom = (
    stopNewLinkId: UUID,
    stopWithRouteGraphData?: ServicePatternScheduledStopPoint,
  ) => {
    if (!stopWithRouteGraphData) {
      return [];
    }

    return (
      stopWithRouteGraphData.scheduled_stop_point_in_journey_patterns
        // we are interested in journey patterns
        .map((item) => item.journey_pattern)
        // check all the journey patterns' routes that this stop is currently part of
        .filter((journeyPattern) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const route = journeyPattern.journey_pattern_route!;

          // check if new link is still part of a route's geometry
          const isNewLinkPartOfRouteGeometry =
            route.infrastructure_links_along_route.some(
              (link) => link.infrastructure_link_id === stopNewLinkId,
            );

          // if new link is not part of the route's existing geometry, the stop should be removed from it
          return !isNewLinkPartOfRouteGeometry;
        })
    );
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareEdit = async ({ stopId, patch }: EditParams) => {
    const stopResult = await getStopById({ stopId });
    const oldStop = mapGetStopByIdResult(stopResult);

    const newLocation = patch.measured_location?.coordinates;
    const oldLocation = oldStop?.measured_location.coordinates;

    const stopRoutesResult = await getStopWithRouteGraphData({
      stop_id: stopId,
    });
    const stopWithRouteGraphData =
      mapGetStopWithRouteGraphDataByIdResult(stopRoutesResult);

    let deleteStopFromJourneyPatterns: JourneyPatternJourneyPattern[] = [];
    let deleteStopFromRoutes: RouteRoute[] = [];

    if (newLocation && !isEqual(newLocation, oldLocation)) {
      // if we modified the location of the stop, have to also fetch the new infra link and direction
      const { closestLink, direction } = await getStopLinkAndDirection({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stopLocation: mapLngLatToPoint(patch.measured_location!.coordinates),
      });
      // eslint-disable-next-line no-param-reassign
      patch.located_on_infrastructure_link_id =
        closestLink.infrastructure_link_id;
      // eslint-disable-next-line no-param-reassign
      patch.direction = direction;

      // check if we tried to move the starting or ending stop of an existing route
      if (isStartingOrEndingStopOfAnyRoute(stopId, stopWithRouteGraphData)) {
        throw new EditRouteTerminalStopsError(
          'Cannot move the starting and ending stops of a route',
        );
      }

      // if a stop is moved away from the route geometry, remove it from its journey patterns
      deleteStopFromJourneyPatterns = getJourneyPatternsToDeleteStopFrom(
        closestLink.infrastructure_link_id,
        stopWithRouteGraphData,
      );
      deleteStopFromRoutes = getRoutesOfJourneyPatterns(
        deleteStopFromJourneyPatterns,
      );
    }

    const editedStop = merge({}, oldStop, patch);
    const changes: EditChanges = {
      stopId,
      patch,
      editedStop,
      deleteStopFromRoutes,
      deleteStopFromJourneyPatterns,
    };

    return changes;
  };

  const mapEditChangesToVariables = (changes: EditChanges) => {
    const variables: EditStopMutationVariables = {
      stop_id: changes.stopId,
      stop_patch: changes.patch,
      delete_from_journey_pattern_ids:
        changes.deleteStopFromJourneyPatterns.map(
          (item) => item.journey_pattern_id,
        ),
    };
    return variables;
  };

  const prepareAndExecute = flow(
    prepareEdit,
    mapEditChangesToVariables,
    editStopMutation,
  );

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof LinkNotResolvedError) {
      showDangerToast(t('stops.fetchClosestLinkFailed'));
      return;
    }
    if (err instanceof DirectionNotResolvedError) {
      showDangerToast(t('stops.fetchDirectionFailed'));
      return;
    }
    if (err instanceof IncompatibleDirectionsError) {
      showDangerToast(t('stops.incompatibleDirections'));
      return;
    }
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t('stops.cannotEditTerminalStops'));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editStopMutation,
    prepareAndExecute,
    defaultErrorHandler,
  };
};
