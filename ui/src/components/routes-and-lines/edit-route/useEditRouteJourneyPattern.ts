import { gql, useApolloClient } from '@apollo/client';
import {
  GetRouteDetailsByIdDocument,
  JourneyPatternStopFragment,
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  RouteWithInfrastructureLinksWithStopsFragment,
  useUpdateRouteJourneyPatternMutation,
} from '../../../generated/graphql';
import {
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
  stopBelongsToJourneyPattern,
} from '../../../graphql';
import { Priority } from '../../../types/enums';
import {
  addOrRemoveStopLabelsFromIncludedStops,
  buildJourneyPatternStopSequence,
  filterDistinctConsecutiveStops,
  mapRouteStopsToJourneyPatternStops,
} from '../../../utils';
import { extractJourneyPatternCandidateStops } from '../../map/routes/hooks/useExtractRouteFromFeature';
import { useValidateRoute } from '../../map/routes/hooks/useValidateRoute';
import {
  StopMetaTypeUpdateInfo,
  filterNeedUpdateByLineType,
  lineTypeAffectsMetatypes,
  resolveStopInfoByPublicCodes,
  useUpdateStopRegistryStopMetatype,
} from '../common/useUpdateStopRegistryStopMetatype';

const GQL_UPDATE_ROUTE_JOURNEY_PATTERN = gql`
  mutation UpdateRouteJourneyPattern(
    $journey_pattern_id: uuid!
    $new_stops_in_journey_pattern: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: { journey_pattern_id: { _eq: $journey_pattern_id } }
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }

    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $new_stops_in_journey_pattern
    ) {
      returning {
        scheduled_stop_point_label
        scheduled_stop_point_sequence
        journey_pattern_id
      }
    }
  }
`;
type DeleteStopParams = {
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly stopPointLabels: ReadonlyArray<string>;
};

type AddStopParams = DeleteStopParams;

export type UpdateJourneyPatternChanges = {
  readonly routeId: UUID;
  readonly journeyPatternId: UUID;
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  readonly includedStopLabels: ReadonlyArray<string>;
  readonly journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
};

export const getEligibleStopsAlongRoute = <
  TRoute extends RouteWithInfrastructureLinksWithStopsFragment,
>(
  route: TRoute,
) => {
  const links = mapInfrastructureLinksAlongRouteToRouteInfraLinks(
    route.infrastructure_links_along_route,
  );
  return extractJourneyPatternCandidateStops(links, route);
};

function usePrepareUpdateJourneyPattern() {
  const client = useApolloClient();
  const { validateStopCount } = useValidateRoute();

  const getStopsNeedingUpdate = async ({
    route,
    stopPointLabels,
  }: AddStopParams): Promise<ReadonlyArray<StopMetaTypeUpdateInfo>> => {
    if (
      route.priority < Priority.Draft && // Draft should not change the stop type.
      lineTypeAffectsMetatypes(route.route_line.type_of_line)
    ) {
      const updatableStops = await resolveStopInfoByPublicCodes(
        client,
        stopPointLabels,
      );
      return updatableStops.filter(
        filterNeedUpdateByLineType(route.route_line.type_of_line),
      );
    }

    return [];
  };

  return async (
    params: AddStopParams | DeleteStopParams,
    stopBelongsToRoute: boolean,
  ): Promise<UpdateJourneyPatternChanges> => {
    const { route, stopPointLabels } = params;

    // TODO: Get rid of stopsEligibleForJourneyPattern in this hook; Why?
    const stopsEligibleForJourneyPattern = filterDistinctConsecutiveStops(
      getEligibleStopsAlongRoute(route),
    );

    const stopLabels = stopsEligibleForJourneyPattern
      // Filter out stops that do not belong to journey pattern and map stops to labels
      .filter((stop) => stopBelongsToJourneyPattern(stop, route.route_id))
      .map((stop) => stop.label);

    const includedStopLabels = addOrRemoveStopLabelsFromIncludedStops(
      stopLabels,
      stopPointLabels,
      stopBelongsToRoute,
    );

    validateStopCount(includedStopLabels);

    const journeyPatternStops = mapRouteStopsToJourneyPatternStops(
      stopsEligibleForJourneyPattern,
      route.route_id,
    );

    const stopsNeedingUpdate = stopBelongsToRoute
      ? await getStopsNeedingUpdate(params)
      : [];

    return {
      routeId: route.route_id,
      // In our data model route has always exactly one journey pattern
      journeyPatternId: route.route_journey_patterns[0].journey_pattern_id,
      stopsEligibleForJourneyPattern,
      includedStopLabels,
      journeyPatternStops,
      stopsNeedingUpdate,
    };
  };
}

/**
 * Hook for adding and removing stops to route's journey pattern.
 */
export function useEditRouteJourneyPattern() {
  const [updateRouteJourneyPatternMutation] =
    useUpdateRouteJourneyPatternMutation();
  const updateStopRegistryStopMetatype = useUpdateStopRegistryStopMetatype();

  const prepareUpdateJourneyPattern = usePrepareUpdateJourneyPattern();

  const prepareAddStopToRoute = (params: AddStopParams) =>
    prepareUpdateJourneyPattern(params, true);

  const prepareDeleteStopFromRoute = (params: DeleteStopParams) =>
    prepareUpdateJourneyPattern(params, false);

  const performUpdate = async (changes: UpdateJourneyPatternChanges) => {
    const journeyPatternUpdate = updateRouteJourneyPatternMutation({
      variables: {
        journey_pattern_id: changes.journeyPatternId,
        new_stops_in_journey_pattern: buildJourneyPatternStopSequence(changes),
      },
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: GetRouteDetailsByIdDocument,
          variables: { routeId: changes.routeId },
        },
      ],
    });

    const stopRegistryStopMetatypeUpdate = updateStopRegistryStopMetatype(
      changes.stopsNeedingUpdate,
    );

    return Promise.all([journeyPatternUpdate, stopRegistryStopMetatypeUpdate]);
  };

  return {
    prepareDeleteStopFromRoute,
    prepareAddStopToRoute,
    performUpdate,
  };
}
