import { gql, useApolloClient } from '@apollo/client';
import {
  GetRoutesBrokenByStopChangeDocument,
  GetRoutesBrokenByStopChangeQuery,
  GetRoutesBrokenByStopChangeQueryVariables,
  RouteAllFieldsFragment,
} from '../../../../generated/graphql';
import { illegalCast } from '../../../../utils';
import { BrokenRouteCheckParams } from '../Types';

const GQL_GET_ROUTES_BROKEN_BY_STOP_CHANGE = gql`
  query GetRoutesBrokenByStopChange(
    $new_located_on_infrastructure_link_id: uuid!
    $new_direction: String!
    $new_label: String!
    $new_validity_start: date
    $new_validity_end: date
    $new_priority: Int!
    $new_measured_location: geography!
    $replace_scheduled_stop_point_id: uuid
    $new_vehicle_mode: String
  ) {
    journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point(
      args: {
        replace_scheduled_stop_point_id: $replace_scheduled_stop_point_id
        new_located_on_infrastructure_link_id: $new_located_on_infrastructure_link_id
        new_direction: $new_direction
        new_label: $new_label
        new_validity_start: $new_validity_start
        new_validity_end: $new_validity_end
        new_priority: $new_priority
        new_measured_location: $new_measured_location
        new_vehicle_mode: $new_vehicle_mode
      }
    ) {
      journey_pattern_id
      journey_pattern_route {
        ...RouteAllFields
      }
    }
  }
`;

type GetRoutesBrokenByStopChangeResult = {
  readonly brokenJourneyPatternIds: ReadonlyArray<string>;
  readonly brokenRoutes: ReadonlyArray<RouteAllFieldsFragment>;
};

export function useGetRoutesBrokenByStopChange() {
  const apollo = useApolloClient();

  return async ({
    newLink,
    newDirection,
    newStop,
    label,
    priority,
    stopId,
    vehicleMode,
  }: BrokenRouteCheckParams): Promise<GetRoutesBrokenByStopChangeResult> => {
    // if a stop is moved away from the route geometry, remove it from its journey patterns
    const brokenRoutesResult = await apollo.query<
      GetRoutesBrokenByStopChangeQuery,
      GetRoutesBrokenByStopChangeQueryVariables
    >({
      query: GetRoutesBrokenByStopChangeDocument,
      variables: {
        new_located_on_infrastructure_link_id: newLink.infrastructure_link_id,
        new_direction: newDirection,
        new_label: label,
        new_validity_start: newStop.validity_start,
        new_validity_end: newStop.validity_end,
        new_priority: priority,
        replace_scheduled_stop_point_id: stopId,
        // data model and form validation should ensure that
        // measured_location always exists
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        new_measured_location: newStop.measured_location!,
        new_vehicle_mode: vehicleMode ?? null,
      },
    });

    const brokenRouteList =
      brokenRoutesResult.data
        ?.journey_pattern_check_infra_link_stop_refs_with_new_scheduled_stop_point ??
      [];

    const brokenJourneyPatternIds = brokenRouteList.map(
      (route) => route.journey_pattern_id,
    );
    const brokenRoutes = brokenRouteList.map((route) =>
      illegalCast<RouteAllFieldsFragment>(route.journey_pattern_route),
    );

    return { brokenJourneyPatternIds, brokenRoutes };
  };
}
