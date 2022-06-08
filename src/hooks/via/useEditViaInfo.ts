import { FormState } from '../../components/routes-and-lines/ViaForm';
import {
  PatchScheduledStopPointViaInfoMutationVariables,
  usePatchScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { removeFromApolloCache } from '../../utils';

interface EditChanges {
  scheduledStopPointId: UUID;
  journeyPatternId: UUID;
  isViaPoint: boolean;
  viaPointName: LocalizedString;
  viaPointShortName: LocalizedString;
}

interface EditParams {
  formState: FormState;
  scheduledStopPointId: UUID;
  journeyPatternId: UUID;
}

export const useEditViaInfo = () => {
  const [updateViaInfo] = usePatchScheduledStopPointViaInfoMutation();

  const prepareEdit = ({
    formState,
    scheduledStopPointId,
    journeyPatternId,
  }: EditParams): EditChanges => ({
    scheduledStopPointId,
    journeyPatternId,
    isViaPoint: true,
    viaPointName: formState.viaPointName,
    viaPointShortName: formState.viaPointShortName,
  });

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchScheduledStopPointViaInfoMutationVariables => ({
    scheduled_stop_point_id: changes.scheduledStopPointId,
    journey_pattern_id: changes.journeyPatternId,
    object: {
      is_via_point: changes.isViaPoint,
      via_point_name_i18n: changes.viaPointName,
      via_point_short_name_i18n: changes.viaPointShortName,
    },
  });

  const editMutation = async (
    variables: PatchScheduledStopPointViaInfoMutationVariables,
  ) => {
    await updateViaInfo({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: variables.scheduled_stop_point_id,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editMutation,
  };
};
