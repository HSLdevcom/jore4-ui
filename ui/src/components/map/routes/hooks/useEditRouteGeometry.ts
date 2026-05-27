import { gql, useApolloClient } from '@apollo/client';
import {
  GetRouteDetailsByIdDocument,
  InfrastructureLinkAllFieldsFragment,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  JourneyPatternStopFragment,
  RouteDefaultFieldsFragment,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteStopFieldsFragment,
  RouteTypeOfLineEnum,
  useUpdateRouteGeometryMutation,
} from '../../../../generated/graphql';
import {
  RouteInfraLink,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../../../graphql';
import { Priority } from '../../../../types/enums';
import { buildJourneyPatternStopSequence } from '../../../../utils';
import {
  StopMetaTypeUpdateInfo,
  filterNeedUpdateByLineType,
  lineTypeAffectsMetatypes,
  resolveStopInfoByPublicCodes,
  updateStopRegistryStopMetatype,
} from '../../../routes-and-lines/common/useUpdateStopRegistryStopMetatype';
import { useValidateRoute } from './useValidateRoute';

const GQL_UPDATE_ROUTE_GEOMETRY = gql`
  mutation UpdateRouteGeometry(
    $route_id: uuid!
    $journey_pattern_id: uuid!
    $new_infrastructure_links: [route_infrastructure_link_along_route_insert_input!]!
    $new_stops_in_journey_pattern: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    delete_route_infrastructure_link_along_route(
      where: { route_id: { _eq: $route_id } }
    ) {
      returning {
        infrastructure_link_id
        infrastructure_link_sequence
        route_id
      }
    }

    insert_route_infrastructure_link_along_route(
      objects: $new_infrastructure_links
    ) {
      returning {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        infrastructure_link {
          infrastructure_link_id
          shape
        }
        is_traversal_forwards
      }
    }

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

type EditParams = {
  readonly routeId: UUID;
  readonly journeyPatternId: UUID;
  readonly infraLinksAlongRoute: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >;
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  readonly includedStopLabels: ReadonlyArray<string>;
  readonly journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
  readonly routePriority: Priority;
  readonly lineType: RouteTypeOfLineEnum;
};

export type EditChanges = {
  readonly routeId: UUID;
  readonly journeyPatternId: UUID;
  readonly newInfrastructureLinks: ReadonlyArray<RouteInfrastructureLinkAlongRouteInsertInput>;
  readonly newStopsInJourneyPattern: ReadonlyArray<JourneyPatternScheduledStopPointInJourneyPatternInsertInput>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
  readonly conflicts: ReadonlyArray<RouteDefaultFieldsFragment>;
};

/**
 * Hook for editing route's geometry (journey pattern and infrastructure links).
 * For editing route metadata (name, label, validity etc.),
 * use editRouteMetadata
 */
export const useEditRouteGeometry = () => {
  const client = useApolloClient();
  const [mutateFunction] = useUpdateRouteGeometryMutation();
  const { validateJourneyPattern } = useValidateRoute();

  const getStopsNeedingUpdate = async (
    routePriority: Priority,
    lineType: RouteTypeOfLineEnum,
    stopPointLabels: ReadonlyArray<string>,
  ): Promise<ReadonlyArray<StopMetaTypeUpdateInfo>> => {
    if (
      routePriority < Priority.Draft && // Draft should not change the stop type.
      lineTypeAffectsMetatypes(lineType)
    ) {
      const updatableStops = await resolveStopInfoByPublicCodes(
        client,
        stopPointLabels,
      );
      return updatableStops.filter(filterNeedUpdateByLineType(lineType));
    }

    return [];
  };

  const prepareEdit = async ({
    routeId,
    infraLinksAlongRoute,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPatternStops,
    journeyPatternId,
    routePriority,
    lineType,
  }: EditParams): Promise<EditChanges> => {
    await validateJourneyPattern({ includedStopLabels });
    const stopsNeedingUpdate = await getStopsNeedingUpdate(
      routePriority,
      lineType,
      includedStopLabels,
    );

    return {
      routeId,
      journeyPatternId,
      newInfrastructureLinks: mapInfraLinksAlongRouteToGraphQL(
        infraLinksAlongRoute,
      ).map((link) => ({ ...link, route_id: routeId })),
      newStopsInJourneyPattern: buildJourneyPatternStopSequence({
        stopsEligibleForJourneyPattern,
        includedStopLabels,
        journeyPatternStops,
        journeyPatternId,
      }),
      stopsNeedingUpdate,
      conflicts: [],
    };
  };

  const editRouteGeometryMutation = async (changes: EditChanges) => {
    await mutateFunction({
      variables: {
        route_id: changes.routeId,
        journey_pattern_id: changes.journeyPatternId,
        new_infrastructure_links: changes.newInfrastructureLinks,
        new_stops_in_journey_pattern: changes.newStopsInJourneyPattern,
      },
      refetchQueries: [
        {
          query: GetRouteDetailsByIdDocument,
          variables: { routeId: changes.routeId },
        },
      ],
    });

    await updateStopRegistryStopMetatype(client, changes.stopsNeedingUpdate);
  };

  return { prepareEditGeometry: prepareEdit, editRouteGeometryMutation };
};
