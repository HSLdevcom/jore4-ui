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
  }: EditParams): EditChanges => {
    return {
      scheduledStopPointId,
      journeyPatternId,
      isViaPoint: true,
      viaPointName: {
        fi_FI: formState.viaPointName.fi_FI,
        sv_FI: formState.viaPointName.sv_FI,
      },
      viaPointShortName: {
        fi_FI: formState.viaPointShortName.fi_FI,
        sv_FI: formState.viaPointShortName.sv_FI,
      },
    };
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchScheduledStopPointViaInfoMutationVariables => {
    return {
      scheduled_stop_point_id: changes.scheduledStopPointId,
      journey_pattern_id: changes.journeyPatternId,
      object: {
        is_via_point: changes.isViaPoint,
        via_point_name_i18n: {
          fi_FI: changes.viaPointName.fi_FI,
          sv_FI: changes.viaPointName.sv_FI,
        },
        via_point_short_name_i18n: {
          fi_FI: changes.viaPointShortName.fi_FI,
          sv_FI: changes.viaPointShortName.sv_FI,
        },
      },
    };
  };

  const editViaInfoMutation = async (
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
    editViaInfoMutation,
  };
};
