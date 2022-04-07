import { gql } from '@apollo/client';
import { loadSchema, LoadSchemaOptions } from '@graphql-tools/load';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

/**
 * merges custom definitions into the schema defined by hasura, overwriting some types (e.g. making them not nullable)
 * based on https://github.com/hasura/graphql-engine/issues/3451#issuecomment-846426643
 */

// Overrides come here...
// Note: if the fields/types change in Hasura, these overrides should also be updated
const hasuraOverrideTypeDefs = gql`
  # define custom scalar for geography types that can only be points
  scalar geography_point
  # define custom scalar for geography types that can only be lines
  scalar geography_linestring

  # setting fields not-nullable in route.route VIEW
  type route_route {
    route_id: uuid!
    starts_from_scheduled_stop_point_id: uuid!
    ends_at_scheduled_stop_point_id: uuid!
    on_line_id: uuid!
    priority: Int!
    label: String!
    direction: String!
    route_shape: geography_linestring
  }

  # setting fields not-nullable in service_pattern.scheduled_stop_point VIEW
  type service_pattern_scheduled_stop_point {
    scheduled_stop_point_id: uuid!
    measured_location: geography_point!
    located_on_infrastructure_link_id: uuid!
    direction: infrastructure_network_direction_enum!
    label: String!
    priority: Int!
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
