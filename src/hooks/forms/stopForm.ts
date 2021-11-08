import { MutationResult } from '@apollo/client';
import { FormState } from '../../components/forms/StopForm';
import {
  InsertStopMutation,
  InsertStopMutationVariables,
  useInsertStopMutation,
  useQueryClosestLinkQuery,
} from '../../generated/graphql';
import { Direction } from '../../types';
import {
  mapCoordinatesToPoint,
  mapToObject,
  mapToVariables,
} from '../../utils';

export const useSubmitCreateStopForm = (): [
  (state: FormState) => Promise<void>,
  MutationResult<InsertStopMutation>,
] => {
  // it would make more sense to `useLazyQuery` as we don't want to execute
  // query right away, but we have to use normal `useQuery` and then use
  // `refetch` function as query function because `useLazyQuery` doesn't
  // currently return promise that could be awaited
  const { refetch: fetchClosestLink } = useQueryClosestLinkQuery();

  const [mutateFunction, mutateResult] = useInsertStopMutation();

  const worker = async (formState: FormState) => {
    const point = mapCoordinatesToPoint({
      lat: formState.lat,
      lng: formState.lng,
    });

    const { data: closestLinkResponse } = await fetchClosestLink({
      point,
    });

    const infraLinkId =
      closestLinkResponse
        ?.infrastructure_network_resolve_point_to_closest_link?.[0]
        ?.infrastructure_link_id;

    if (!infraLinkId) {
      // eslint-disable-next-line no-console
      console.log(`Failed to map point ${point} to infra link id.`);
      // eslint-disable-next-line no-console
      console.log('TODO: show error message');
      return;
    }

    const payload: InsertStopMutationVariables = mapToObject({
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

    mutateFunction(mapToVariables(payload));
  };
  return [worker, mutateResult];
};
