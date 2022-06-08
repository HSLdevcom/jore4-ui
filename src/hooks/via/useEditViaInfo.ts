import { FormState } from '../../components/routes-and-lines/via/ViaForm';
import {
  PatchScheduledStopPointViaInfoMutationVariables,
  usePatchScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { MutationHook } from '../mutationHook';

interface EditChanges {
  journeyPatternId: UUID;
  stopLabel: string;
  isViaPoint: boolean;
  viaPointName: LocalizedString;
  viaPointShortName: LocalizedString;
}

interface EditParams {
  formState: FormState;
  journeyPatternId: UUID;
  stopLabel: string;
}

// Note: this will set the VIA info to _all_ of the instances of the stop with the given label
// within the journey pattern. E.g. if the bus travels in a loop and visits the same stop multiple
// times, all of those will have the same VIA info attached.
// In the future, we might want to clarify that which instance of the stop needs to get the VIA info,
// but as this is a very rare corner case for HSL, we'll go with this solution for now for simplicity.
export const useEditViaInfo: MutationHook<
  EditParams,
  EditChanges,
  PatchScheduledStopPointViaInfoMutationVariables
> = () => {
  const [updateViaInfo] = usePatchScheduledStopPointViaInfoMutation();

  const prepare = ({
    formState,
    journeyPatternId,
    stopLabel,
  }: EditParams): EditChanges => ({
    journeyPatternId,
    stopLabel,
    isViaPoint: true,
    viaPointName: formState.viaPointName,
    viaPointShortName: formState.viaPointShortName,
  });

  const mapChangesToVariables = ({
    journeyPatternId,
    stopLabel,
    isViaPoint,
    viaPointName,
    viaPointShortName,
  }: EditChanges): PatchScheduledStopPointViaInfoMutationVariables => ({
    journeyPatternId,
    stopLabel,
    viaInfo: {
      is_via_point: isViaPoint,
      via_point_name_i18n: viaPointName,
      via_point_short_name_i18n: viaPointShortName,
    },
  });

  const executeMutation = async (
    variables: PatchScheduledStopPointViaInfoMutationVariables,
  ) =>
    updateViaInfo({
      variables,
    });

  return {
    prepare,
    mapChangesToVariables,
    executeMutation,
  };
};
