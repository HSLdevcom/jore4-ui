import { gql, useApolloClient } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import { useTranslation } from 'react-i18next';
import {
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  JourneyPatternJourneyPattern,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  useRemoveStopMutation,
} from '../../../../generated/graphql';
import {
  EditRouteTerminalStopsError,
  InternalError,
  illegalOptionalCast,
  showDangerToast,
  showDangerToastWithError,
} from '../../../../utils';
import { useDeleteQuay } from '../../../stop-registry/stops/queries/useDeleteQuay';

const GQL_REMOVE_STOP = gql`
  mutation RemoveStop($stop_id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $stop_id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

type DeleteParams = {
  readonly stopPointId: UUID;
  readonly stopPlaceId: string;
  readonly quayId: string;
};

export type DeleteChanges = DeleteParams & {
  readonly deletedStopPoint: ServicePatternScheduledStopPoint;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

// gets the unique list of parent routes for the input journey patterns
function getRoutesOfJourneyPatterns(
  journeyPatterns: ReadonlyArray<JourneyPatternJourneyPattern>,
) {
  const allRoutes = journeyPatterns
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((item) => item.journey_pattern_route!);

  // in the future, multiple journey patterns may have the same route,
  // so let's make sure we only return unique results
  return uniqBy(allRoutes, (route) => route.route_id);
}

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
  const apollo = useApolloClient();

  return async (deleteParams: DeleteParams) => {
    const { stopPointId } = deleteParams;

    // Check if we tried to delete the starting or ending stop of an existing route.
    const stopWithRoutesResult = await apollo.query<
      GetStopWithRouteGraphDataByIdQuery,
      GetStopWithRouteGraphDataByIdQueryVariables
    >({
      query: GetStopWithRouteGraphDataByIdDocument,
      variables: { stopId: stopPointId },
    });
    const stopWithRouteGraphData =
      illegalOptionalCast<ServicePatternScheduledStopPoint>(
        stopWithRoutesResult.data.service_pattern_scheduled_stop_point.at(0),
      );

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

export function useDeleteStop() {
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
    });

    const removedQuayResult = await deleteQuay(stopPlaceId, quayId);

    return { removedStopPointResult, removedQuayResult };
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t(($) => $.stops.cannotEditTerminalStops));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return { prepareDelete, removeStop, defaultErrorHandler };
}
