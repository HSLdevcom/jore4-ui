import flow from 'lodash/flow';
import {
  InsertStopMutationVariables,
  ServicePatternScheduledStopPointInsertInput,
  useInsertStopMutation,
} from '../../generated/graphql';
import { OptionalKeys } from '../../types';
import { mapLngLatToPoint } from '../../utils';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';

// the input does not need to contain all the fields
export type CreateInput = OptionalKeys<
  ServicePatternScheduledStopPointInsertInput,
  'direction' | 'located_on_infrastructure_link_id'
>;

interface CreateParams {
  input: CreateInput;
}
interface CreateChanges {
  stopToCreate: ServicePatternScheduledStopPointInsertInput;
}

export const useCreateStop = () => {
  const [insertStopMutation] = useInsertStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareCreate = async ({ input }: CreateParams) => {
    // we need to fetch the infra link and direction for the stop
    const { closestLinkId, direction } = await getStopLinkAndDirection({
      stopLocation: mapLngLatToPoint(input.measured_location.coordinates),
    });

    const stopToCreate: ServicePatternScheduledStopPointInsertInput = {
      ...input,
      located_on_infrastructure_link_id: closestLinkId,
      direction,
    };

    const changes: CreateChanges = {
      stopToCreate,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) => {
    const variables: InsertStopMutationVariables = {
      object: changes.stopToCreate,
    };
    return variables;
  };

  const prepareAndExecute = flow(
    prepareCreate,
    mapCreateChangesToVariables,
    insertStopMutation,
  );

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertStopMutation,
    prepareAndExecute,
  };
};
