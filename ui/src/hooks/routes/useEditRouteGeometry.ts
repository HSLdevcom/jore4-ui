import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  GetRouteDetailsByIdDocument,
  InfrastructureLinkAllFieldsFragment,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  JourneyPatternStopFragment,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteStopFieldsFragment,
  UpdateRouteGeometryMutationVariables,
  useUpdateRouteGeometryMutation,
} from '../../generated/graphql';
import {
  RouteInfraLink,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../graphql';
import {
  buildJourneyPatternStopSequence,
  removeFromApolloCache,
  showDangerToastWithError,
} from '../../utils';
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

interface EditParams {
  routeId: UUID;
  journeyPatternId: UUID;
  infraLinksAlongRoute: RouteInfraLink<InfrastructureLinkAllFieldsFragment>[];
  stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  includedStopLabels: ReadonlyArray<string>;
  journeyPatternStops: ReadonlyArray<JourneyPatternStopFragment>;
}

interface EditChanges {
  routeId: UUID;
  journeyPatternId: UUID;
  newInfrastructureLinks: RouteInfrastructureLinkAlongRouteInsertInput[];
  newStopsInJourneyPattern: JourneyPatternScheduledStopPointInJourneyPatternInsertInput[];
}

/**
 * Hook for editing route's geometry (journey pattern and infrastructure links).
 * For editing route metadata (name, label, validity etc.),
 * use editRouteMetadata
 */
export const useEditRouteGeometry = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useUpdateRouteGeometryMutation();
  const { validateJourneyPattern } = useValidateRoute();

  const prepareEdit = async ({
    routeId,
    infraLinksAlongRoute,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPatternStops,
    journeyPatternId,
  }: EditParams) => {
    await validateJourneyPattern({ includedStopLabels });

    const changes: EditChanges = {
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
    };

    return changes;
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): UpdateRouteGeometryMutationVariables => ({
    route_id: changes.routeId,
    journey_pattern_id: changes.journeyPatternId,
    new_infrastructure_links: changes.newInfrastructureLinks,
    new_stops_in_journey_pattern: changes.newStopsInJourneyPattern,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  const editRouteGeometryMutation = async (
    variables: UpdateRouteGeometryMutationVariables,
  ) => {
    await mutateFunction({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          route_id: variables.route_id,
          __typename: 'route_route',
        });
      },
      refetchQueries: [
        {
          query: GetRouteDetailsByIdDocument,
          variables: { routeId: variables.route_id },
        },
      ],
    });
  };

  return {
    prepareEditGeometry: prepareEdit,
    mapEditGeometryChangesToVariables: mapEditChangesToVariables,
    editRouteGeometryMutation,
    defaultErrorHandler,
  };
};
