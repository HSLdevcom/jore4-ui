import flow from 'lodash/flow';
import {
  InsertStopMutationVariables,
  ServicePatternScheduledStopPointInsertInput,
  useInsertStopMutation,
} from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';
import { OptionalKeys } from '../../types';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';

// the input does not need to contain all the fields
export type CreateInput = OptionalKeys<
  ServicePatternScheduledStopPointInsertInput,
  'direction' | 'located_on_infrastructure_link_id'
>;

interface CreateParams {
  input: CreateInput;
}
export interface CreateChanges {
  stopToCreate: ServicePatternScheduledStopPointInsertInput;
}

export const useCreateStop = () => {
  const [insertStopMutation] = useInsertStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();

  // pre-fills and pre-validates a few fields for the draft stop
  // throws exceptions in case or error
  const createDraftStop = async (stopLocation: GeoJSON.Point) => {
    const draftStop: StopWithLocation = {
      measured_location: stopLocation,
    };

    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation,
    });
    draftStop.located_on_infrastructure_link_id =
      closestLink.infrastructure_link_id;
    draftStop.direction = direction;

    return draftStop;
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareCreate = async ({ input }: CreateParams) => {
    // we need to fetch the infra link and direction for the stop
    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: input.measured_location,
    });

    const stopToCreate: ServicePatternScheduledStopPointInsertInput = {
      ...input,
      located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
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
    createDraftStop,
    prepareCreate,
    mapCreateChangesToVariables,
    insertStopMutation,
    prepareAndExecute,
  };
};
