import { ApolloClient } from '@apollo/client';
import { FormState } from '../components/forms/StopForm'; // eslint-disable-line import/no-cycle
import {
  InsertStopMutation,
  InsertStopMutationVariables,
  QueryClosestLinkQueryResult,
  QueryClosestLinkQueryVariables,
  Scalars,
} from '../generated/graphql';
import { INSERT_STOP } from '../graphql/mutations';
import { QUERY_CLOSEST_LINK } from '../graphql/queries';
import { Direction } from '../types';
import { mapPointToPointGeography, mapToObject } from '../utils';

const fetchClosestLink = async (
  client: ApolloClient<ExplicitAny>,
  point: Scalars['geography'],
) => {
  const result = await client.query<
    QueryClosestLinkQueryResult,
    QueryClosestLinkQueryVariables
  >({
    query: QUERY_CLOSEST_LINK,
    variables: { point },
  });
  return result;
};

export const submitStopForm = async (
  client: ApolloClient<ExplicitAny>,
  formState: FormState,
) => {
  const point = mapPointToPointGeography({
    latitude: formState.latitude,
    longitude: formState.longitude,
  });

  const closestLinkResponse = await fetchClosestLink(client, point);

  // prettier wants to move @ts-expect-error to incorrect line
  // prettier-ignore
  const infraLinkId =
    closestLinkResponse.data
    // @ts-expect-error typings are off or then we are using wrong types above
      ?.infrastructure_network_resolve_point_to_closest_link?.[0]
      ?.infrastructure_link_id;

  if (!infraLinkId) {
    throw new Error(
      `Failed to map point "${JSON.stringify(
        point,
        null,
        2,
      )}" to infra link id.`,
    );
  }

  const variables: InsertStopMutationVariables = mapToObject({
    located_on_infrastructure_link_id: infraLinkId,
    // TODO: we need hasura function for calculating direction similarly as we do
    // calcutate `located_on_infrastructure_link_id` and then we have to fetch
    // it here similarly. Use hardcoded value until that function is available.
    direction: Direction.BiDirectional,
    measured_location: point,
    // TODO: how we should calculate label? Use finnishName as label for now as
    // have been done in jore3 importer, but it won't be correct solution in the long
    // term.
    label: formState.finnishName,
  });

  const result = client.mutate<InsertStopMutation, InsertStopMutationVariables>(
    {
      mutation: INSERT_STOP,
      variables,
    },
  );

  return result;
};
