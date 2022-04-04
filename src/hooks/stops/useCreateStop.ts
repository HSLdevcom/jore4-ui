import flow from 'lodash/flow';
import {
  InsertStopMutationVariables,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointInsertInput,
  useInsertStopMutation,
} from '../../generated/graphql';
import { mapLngLatToPoint } from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useGetStopLinkAndDirection } from './useGetStopLinkAndDirection';

interface CreateParams {
  input: ServicePatternScheduledStopPointInsertInput;
}
interface CreateChanges {
  stopToCreate: ServicePatternScheduledStopPointInsertInput;
  conflicts?: ServicePatternScheduledStopPoint[];
}

export const useCreateStop = () => {
  const [insertStopMutation] = useInsertStopMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();
  const { getConflictingStops } = useCheckValidityAndPriorityConflicts();

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareCreate = async ({ input }: CreateParams) => {
    const conflicts = await getConflictingStops({
      // these form values always exist
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      label: input.label!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      priority: input.priority!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      validityStart: input.validity_start!,
      validityEnd: input.validity_end || undefined,
    });
    const changes: CreateChanges = {
      stopToCreate: input,
      conflicts,
    };

    if (changes.stopToCreate.measured_location) {
      // we need to fetch the infra link and direction for the stop
      const { closestLinkId, direction } = await getStopLinkAndDirection({
        stopLocation: mapLngLatToPoint(
          changes.stopToCreate.measured_location.coordinates,
        ),
      });
      changes.stopToCreate.located_on_infrastructure_link_id = closestLinkId;
      changes.stopToCreate.direction = direction;
    }

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
