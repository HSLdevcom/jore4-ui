import { loadSchema, LoadSchemaOptions } from '@graphql-tools/load';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { gql } from 'graphql-tag';

/**
 * merges custom definitions into the schema defined by hasura, overwriting some types (e.g. making them not nullable)
 * based on https://github.com/hasura/graphql-engine/issues/3451#issuecomment-846426643
 */

// TODO: currently the unique_label is overridden here to be not nullable, but this should be
// done in hasura. unique_label field is computed field and it includes label field, which is
// not nullable, so this can't ever be null.

// Overrides come here...
// Note: if the fields/types change in Hasura, these overrides should also be updated
const hasuraOverrideTypeDefs = gql`
  # define custom scalar for geography types that can only be points
  scalar geography_point
  # define custom scalar for geography types that can only be lines
  scalar geography_linestring
  # defined custom scalar for jsonb fields that contain localized strings
  scalar localized_string

  # fixing the types of some route.route fields
  type route_route {
    name_i18n: localized_string!
    description_i18n: localized_string
    origin_name_i18n: localized_string!
    origin_short_name_i18n: localized_string!
    destination_name_i18n: localized_string!
    destination_short_name_i18n: localized_string!
    route_shape: geography_linestring
    route_line: route_line!
    unique_label: String!
  }
  type route_route_set_input {
    name_i18n: localized_string
    description_i18n: localized_string
    origin_name_i18n: localized_string
    origin_short_name_i18n: localized_string
    destination_name_i18n: localized_string
    destination_short_name_i18n: localized_string
  }
  type route_route_insert_input {
    label: String!
    name_i18n: localized_string!
    description_i18n: localized_string
    origin_name_i18n: localized_string!
    origin_short_name_i18n: localized_string!
    destination_name_i18n: localized_string!
    destination_short_name_i18n: localized_string!
  }

  # fixing the types of some route.line fields
  type route_line {
    name_i18n: localized_string!
    short_name_i18n: localized_string!
  }
  type route_line_set_input {
    name_i18n: localized_string
    short_name_i18n: localized_string
  }
  type route_line_insert_input {
    name_i18n: localized_string!
    short_name_i18n: localized_string!
  }

  # setting fields not-nullable in service_pattern.scheduled_stop_point VIEW
  type service_pattern_scheduled_stop_point {
    scheduled_stop_point_id: uuid!
    measured_location: geography_point!
    closest_point_on_infrastructure_link: geography_point
    located_on_infrastructure_link_id: uuid!
    direction: infrastructure_network_direction_enum!
    label: String!
    priority: Int!
    relative_distance_from_infrastructure_link_start: Float!
  }

  # settings fields for service_pattern.scheduled_stop_point update (patch) object
  type service_pattern_scheduled_stop_point_set_input {
    # these can be undefined (=unset) but not null
    # unfortunately the typing has to be fixed in TypeScript side
    measured_location: geography_point
    located_on_infrastructure_link_id: uuid
    direction: infrastructure_network_direction_enum
    label: String
    priority: Int
  }

  # settings fields for service_pattern.scheduled_stop_point insert object
  type service_pattern_scheduled_stop_point_insert_input {
    measured_location: geography_point!
    located_on_infrastructure_link_id: uuid!
    direction: infrastructure_network_direction_enum!
    label: String!
    priority: Int!
  }

  # returned fields for infrastructure_network_find_point_direction_on_link function
  type infrastructure_network_direction {
    value: infrastructure_network_direction_enum!
  }

  type journey_pattern_scheduled_stop_point_in_journey_pattern {
    via_point_name_i18n: localized_string
    via_point_short_name_i18n: localized_string
  }

  type journey_pattern_scheduled_stop_point_in_journey_pattern_set_input {
    via_point_name_i18n: localized_string
    via_point_short_name_i18n: localized_string
  }

  type journey_pattern_scheduled_stop_point_in_journey_pattern_insert_input {
    via_point_name_i18n: localized_string
    via_point_short_name_i18n: localized_string
  }

  type infrastructure_network_infrastructure_link {
    shape: geography_linestring! # fix the geography type
  }

  interface validity_period {
    validity_start: date
    validity_end: date
  }

  type timetables_vehicle_journey_vehicle_journey {
    start_time: interval!
    end_time: interval!
  }
`;

// Note: if want to make custom directives for the schema, here are some examples on how to do so:
// https://www.graphql-tools.com/docs/schema-directives#examples

// eslint-disable-next-line import/no-default-export
export default async (schemaString: string, config: LoadSchemaOptions) => {
  const hasuraSchema = await loadSchema(schemaString, config);

  const mergedTypeDefs = mergeTypeDefs([hasuraOverrideTypeDefs, hasuraSchema], {
    ignoreFieldConflicts: true,
  });

  const mergedSchema = makeExecutableSchema({
    typeDefs: mergedTypeDefs,
  });

  return mergedSchema;
};
