import { gql } from 'graphql-tag';
import {
  InfrastructureNetworkInfrastructureLinkInsertInput,
  JourneyPatternJourneyPatternInsertInput,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  ServicePatternScheduledStopPointInsertInput,
  TimingPatternTimingPlaceInsertInput,
} from '../../generated/graphql';
import { getGqlString } from './utils';

const GQL_INSERT_LINES = gql`
  mutation InsertLines($objects: [route_line_insert_input!]!) {
    insert_route_line(objects: $objects) {
      returning {
        line_id
        label
        priority
        primary_vehicle_mode
        transport_target
        validity_start
        validity_end
      }
    }
  }
`;

export const mapToCreateLinesMutation = (objects: RouteLineInsertInput[]) => {
  return {
    operationName: 'InsertLines',
    query: getGqlString(GQL_INSERT_LINES),
    variables: { objects },
  };
};

const GQL_INSERT_ROUTES = gql`
  mutation InsertRoutes($objects: [route_route_insert_input!]!) {
    insert_route_route(objects: $objects) {
      returning {
        route_id
        name_i18n
        description_i18n
        origin_name_i18n
        origin_short_name_i18n
        destination_name_i18n
        destination_short_name_i18n
        route_shape
        on_line_id
        validity_start
        validity_end
        priority
        label
        direction
      }
    }
  }
`;

export const mapToCreateRoutesMutation = (objects: RouteRouteInsertInput[]) => {
  return {
    operationName: 'InsertRoutes',
    query: getGqlString(GQL_INSERT_ROUTES),
    variables: { objects },
  };
};

const GQL_DELETE_ROUTES = gql`
  mutation DeleteRoutes($route_id: [uuid!]!) {
    delete_route_route(where: { route_id: { _in: $route_id } }) {
      returning {
        route_id
      }
    }
  }
`;

export const mapToDeleteRoutesMutation = (uuid: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_ROUTES),
    variables: { route_id: uuid },
  };
};

// ...line_all_fields
const GQL_DELETE_LINES = gql`
  mutation RemoveLines($line_ids: [uuid!]!) {
    delete_route_line(where: { line_id: { _in: $line_ids } }) {
      returning {
        line_id
      }
    }
  }
`;

export const mapToDeleteLinesMutation = (lineUuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_LINES),
    variables: { line_ids: lineUuids },
  };
};

const GQL_INSERT_TIMING_PLACES = gql`
  mutation InsertTimingPlaces(
    $objects: [timing_pattern_timing_place_insert_input!]!
  ) {
    insert_timing_pattern_timing_place(objects: $objects) {
      returning {
        description
        label
        timing_place_id
      }
    }
  }
`;

export const mapToCreateTimingPlacesMutation = (
  objects: TimingPatternTimingPlaceInsertInput[],
) => {
  return {
    operationName: 'InsertTimingPlaces',
    query: getGqlString(GQL_INSERT_TIMING_PLACES),
    variables: { objects },
  };
};

const GQL_DELETE_TIMING_PLACES = gql`
  mutation RemoveTimingPlaces($timing_place_ids: [uuid!]!) {
    delete_timing_pattern_timing_place(
      where: { timing_place_id: { _in: $timing_place_ids } }
    ) {
      returning {
        timing_place_id
      }
    }
  }
`;

export const mapToDeleteTimingPlacesMutation = (timingPlaceUuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_TIMING_PLACES),
    variables: { timing_place_ids: timingPlaceUuids },
  };
};

const GQL_INSERT_STOPS = gql`
  mutation InsertStops(
    $objects: [service_pattern_scheduled_stop_point_insert_input!]!
  ) {
    insert_service_pattern_scheduled_stop_point(objects: $objects) {
      returning {
        scheduled_stop_point_id
        located_on_infrastructure_link_id
        direction
        priority
        measured_location
        label
        validity_start
        validity_end
      }
    }
  }
`;

export const mapToCreateStopsMutation = (
  objects: ServicePatternScheduledStopPointInsertInput[],
) => {
  return {
    operationName: 'InsertStops',
    query: getGqlString(GQL_INSERT_STOPS),
    variables: { objects },
  };
};

const GQL_DELETE_STOPS = gql`
  mutation RemoveStops($stop_ids: [uuid!]!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _in: $stop_ids } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

export const mapToDeleteStopsMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_STOPS),
    variables: { stop_ids: uuids },
  };
};

const GQL_INSERT_INFRA_LINKS = gql`
  mutation InsertInfraLinks(
    $objects: [infrastructure_network_infrastructure_link_insert_input!]!
  ) {
    insert_infrastructure_network_infrastructure_link(objects: $objects) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToCreateInfraLinksMutation = (
  objects: InfrastructureNetworkInfrastructureLinkInsertInput[],
) => {
  return {
    operationName: 'InsertInfraLinks',
    query: getGqlString(GQL_INSERT_INFRA_LINKS),
    variables: { objects },
  };
};

const GQL_DELETE_INFRA_LINKS = gql`
  mutation RemoveInfraLinks($infra_links_ids: [uuid!]!) {
    delete_infrastructure_network_infrastructure_link(
      where: { infrastructure_link_id: { _in: $infra_links_ids } }
    ) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToDeleteInfraLinksMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_INFRA_LINKS),
    variables: { infra_links_ids: uuids },
  };
};

export interface VehicleSubmodeOnInfraLinkInsertInput {
  infrastructure_link_id: UUID;
  vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
}

const GQL_INSERT_INFRA_LINKS_ALONG_ROUTE = gql`
  mutation InsertInfraLinksAlongRoute(
    $objects: [route_infrastructure_link_along_route_insert_input!]!
  ) {
    insert_route_infrastructure_link_along_route(objects: $objects) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToCreateInfraLinkAlongRouteMutation = (
  objects: RouteInfrastructureLinkAlongRouteInsertInput[],
) => {
  return {
    operationName: 'InsertInfraLinksAlongRoute',
    query: getGqlString(GQL_INSERT_INFRA_LINKS_ALONG_ROUTE),
    variables: { objects },
  };
};

const GQL_DELETE_INFRA_LINKS_ALONG_ROUTE = gql`
  mutation RemoveInfraLinksAlongRoute($infra_links_ids: [uuid!]!) {
    delete_route_infrastructure_link_along_route(
      where: { infrastructure_link_id: { _in: $infra_links_ids } }
    ) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToDeleteInfraLinksAlongRouteMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_INFRA_LINKS_ALONG_ROUTE),
    variables: { infra_links_ids: uuids },
  };
};

const GQL_INSERT_JOURNEY_PATTERNS = gql`
  mutation InsertJourneyPatterns(
    $objects: [journey_pattern_journey_pattern_insert_input!]!
  ) {
    insert_journey_pattern_journey_pattern(objects: $objects) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToCreateJourneyPatternsMutation = (
  objects: JourneyPatternJourneyPatternInsertInput[],
) => {
  return {
    operationName: 'InsertJourneyPatterns',
    query: getGqlString(GQL_INSERT_JOURNEY_PATTERNS),
    variables: { objects },
  };
};

const GQL_DELETE_JOURNEY_PATTERNS = gql`
  mutation RemoveJourneyPatterns($journey_pattern_ids: [uuid!]!) {
    delete_journey_pattern_journey_pattern(
      where: { journey_pattern_id: { _in: $journey_pattern_ids } }
    ) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToDeleteJourneyPatternsMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_JOURNEY_PATTERNS),
    variables: { journey_pattern_ids: uuids },
  };
};

const GQL_INSERT_STOPS_IN_JOURNEY_PATTERN = gql`
  mutation InsertStopsInJourneyPattern(
    $objects: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $objects
    ) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToCreateStopsOnJourneyPatternMutation = (
  objects: JourneyPatternScheduledStopPointInJourneyPatternInsertInput[],
) => {
  return {
    operationName: 'InsertStopsInJourneyPattern',
    query: getGqlString(GQL_INSERT_STOPS_IN_JOURNEY_PATTERN),
    variables: { objects },
  };
};

const GQL_DELETE_STOPS_IN_JOURNEY_PATTERN = gql`
  mutation RemoveStopsInJourneyPattern($journey_pattern_ids: [uuid!]!) {
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: { journey_pattern_id: { _in: $journey_pattern_ids } }
    ) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToDeleteStopsInJourneyPatternMutation = (uuids: UUID[]) => {
  return {
    query: getGqlString(GQL_DELETE_STOPS_IN_JOURNEY_PATTERN),
    variables: { journey_pattern_ids: uuids },
  };
};
