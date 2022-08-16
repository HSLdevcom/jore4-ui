import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql/language/ast';
import { getDbConnection } from '../DbManager';
import {
  InfrastructureNetworkInfrastructureLinkInsertInput,
  JourneyPatternJourneyPatternInsertInput,
  JourneyPatternScheduledStopPointInJourneyPatternInsertInput,
  ReusableComponentsVehicleSubmodeEnum,
  RouteInfrastructureLinkAlongRouteInsertInput,
  RouteLineInsertInput,
  RouteRouteInsertInput,
  ServicePatternScheduledStopPointInsertInput,
} from '../generated/graphql';

const getGqlString = (doc: DocumentNode) => {
  return doc.loc && doc.loc.source.body;
};

const GQL_INSERT_LINES = gql`
  mutation InsertLines($object: [route_line_insert_input!]!) {
    insert_route_line(objects: $object) {
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

export const mapToCreateLinesMutation = (object: RouteLineInsertInput[]) => {
  return {
    operationName: 'InsertLines',
    query: getGqlString(GQL_INSERT_LINES),
    variables: { object },
  };
};

// TODO: "returning {...route_all_fields }""
const GQL_INSERT_ROUTES = gql`
  mutation InsertRoutes($object: [route_route_insert_input!]!) {
    insert_route_route(objects: $object) {
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

export const mapToCreateRoutesMutation = (object: RouteRouteInsertInput[]) => {
  return {
    operationName: 'InsertRoutes',
    query: getGqlString(GQL_INSERT_ROUTES),
    variables: { object },
  };
};

const GQL_DELETE_ROUTES = gql`
  mutation DeleteRoute($route_id: [uuid!]!) {
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

const GQL_INSERT_STOPS = gql`
  mutation InsertStops(
    $object: [service_pattern_scheduled_stop_point_insert_input!]!
  ) {
    insert_service_pattern_scheduled_stop_point(objects: $object) {
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
  object: ServicePatternScheduledStopPointInsertInput[],
) => {
  return {
    operationName: 'InsertStops',
    query: getGqlString(GQL_INSERT_STOPS),
    variables: { object },
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
    $object: [infrastructure_network_infrastructure_link_insert_input!]!
  ) {
    insert_infrastructure_network_infrastructure_link(objects: $object) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToCreateInfraLinksMutation = (
  object: InfrastructureNetworkInfrastructureLinkInsertInput[],
) => {
  return {
    operationName: 'InsertInfraLinks',
    query: getGqlString(GQL_INSERT_INFRA_LINKS),
    variables: { object },
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

interface VehicleSubmodeOnInfraLinkInsertInput {
  // eslint-disable-next-line camelcase
  infrastructure_link_id: UUID;
  // eslint-disable-next-line camelcase
  vehicle_submode: ReusableComponentsVehicleSubmodeEnum;
}

// Vehicle submodes on infra links can't be handled with hasura api because
// hasura splits infrastructure_network_vehicle_submode_on_infrastructure_link__all_columns_alias
// and infrastructure_network_vehicle_submode_on_infrastructure_link__mutation_result_alias
// at 64 characters and that causes conflicts because both are the same for the first > 64 characters.
//
// That causes following error:
// "WITH query name \"infrastructure_network_vehicle_submode_on_infrastructure_link__\" specified more than once"
//
// Thus we have to use raw sql connection for handling those.
// (Other solution could be renaming the tables.)
export const insertVehicleSubmodeOnInfraLink = (
  infraLinks: VehicleSubmodeOnInfraLinkInsertInput[],
) => {
  const db = getDbConnection();

  return db('infrastructure_network.vehicle_submode_on_infrastructure_link')
    .returning(['infrastructure_link_id', 'vehicle_submode'])
    .insert(infraLinks);
};

export const removeVehicleSubmodeOnInfraLink = (
  infraLinks: VehicleSubmodeOnInfraLinkInsertInput[],
) => {
  const db = getDbConnection();
  return db('infrastructure_network.vehicle_submode_on_infrastructure_link')
    .whereIn(
      'infrastructure_link_id',
      infraLinks.map((item) => item.infrastructure_link_id),
    )
    .whereIn(
      'vehicle_submode',
      infraLinks.map((item) => item.vehicle_submode),
    )
    .returning(['infrastructure_link_id', 'vehicle_submode'])
    .del();
};

const GQL_INSERT_INFRA_LINKS_ALONG_ROUTE = gql`
  mutation InsertInfraLinksAlongRoute(
    $object: [route_infrastructure_link_along_route_insert_input!]!
  ) {
    insert_route_infrastructure_link_along_route(objects: $object) {
      returning {
        infrastructure_link_id
      }
    }
  }
`;

export const mapToCreateInfraLinkAlongRouteMutation = (
  object: RouteInfrastructureLinkAlongRouteInsertInput[],
) => {
  return {
    operationName: 'InsertInfraLinksAlongRoute',
    query: getGqlString(GQL_INSERT_INFRA_LINKS_ALONG_ROUTE),
    variables: { object },
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
    $object: [journey_pattern_journey_pattern_insert_input!]!
  ) {
    insert_journey_pattern_journey_pattern(objects: $object) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToCreateJourneyPatternsMutation = (
  object: JourneyPatternJourneyPatternInsertInput[],
) => {
  return {
    operationName: 'InsertJourneyPatterns',
    query: getGqlString(GQL_INSERT_JOURNEY_PATTERNS),
    variables: { object },
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
    $object: [journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input!]!
  ) {
    insert_journey_pattern_scheduled_stop_point_in_journey_pattern(
      objects: $object
    ) {
      returning {
        journey_pattern_id
      }
    }
  }
`;

export const mapToCreateStopsOnJourneyPatternMutation = (
  object: JourneyPatternScheduledStopPointInJourneyPatternInsertInput[],
) => {
  return {
    operationName: 'InsertStopsInJourneyPattern',
    query: getGqlString(GQL_INSERT_STOPS_IN_JOURNEY_PATTERN),
    variables: { object },
  };
};

const GQL_DELETE_STOPS_IN_JOURNEY_PATTERN = gql`
  mutation RemoveJourneyPattern($journey_pattern_ids: [uuid!]!) {
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
