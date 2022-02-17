const { loadSchema } = require('@graphql-tools/load');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { gql } = require('graphql-tag');
/**
 * merges custom definitions into the schema defined by hasura, overwriting some types (e.g. making them not nullable)
 * based on https://github.com/hasura/graphql-engine/issues/3451#issuecomment-846426643
 */
module.exports = async (schemaString, config) => {
  const hasuraSchema = await loadSchema(schemaString, config);

  return mergeTypeDefs(
    [
      // Overrides come here...
      // Note: if the fields/types change in Hasura, these overrides should also be updated
      gql`
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
          direction: String!
          label: String!
          priority: Int!
        }
      `,
      hasuraSchema,
    ],
    {
      ignoreFieldConflicts: true,
    },
  );
};
