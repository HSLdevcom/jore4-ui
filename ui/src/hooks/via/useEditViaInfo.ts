import { FormState } from '../../components/routes-and-lines/via/ViaForm';
import {
  JourneyPatternScheduledStopPointInJourneyPatternSetInput,
  PatchScheduledStopPointViaInfoMutationVariables,
  usePatchScheduledStopPointViaInfoMutation,
} from '../../generated/graphql';
import { MutationHook, extendHook } from '../mutationHook';

type ViaInfoPatch = Pick<
  JourneyPatternScheduledStopPointInJourneyPatternSetInput,
  'is_via_point' | 'via_point_name_i18n' | 'via_point_short_name_i18n'
>;

type EditParams = {
  readonly form: FormState;
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
};

type EditChanges = {
  readonly journeyPatternId: UUID;
  readonly stopLabel: string;
  readonly patch: ViaInfoPatch;
};

// Note: this will set the VIA info to _all_ of the instances of the stop with the given label
// within the journey pattern. E.g. if the bus travels in a loop and visits the same stop multiple
// times, all of those will have the same VIA info attached.
// In the future, we might want to clarify that which instance of the stop needs to get the VIA info,
// but as this is a very rare corner case for HSL, we'll go with this solution for now for simplicity.
const useEditViaInfoHook: MutationHook<
  EditParams,
  EditChanges,
  PatchScheduledStopPointViaInfoMutationVariables
> = () => {
  const [updateViaInfo] = usePatchScheduledStopPointViaInfoMutation();

  const prepare = ({
    form,
    journeyPatternId,
    stopLabel,
  }: EditParams): EditChanges => ({
    journeyPatternId,
    stopLabel,
    patch: {
      is_via_point: true,
      via_point_name_i18n: form.viaPointName,
      via_point_short_name_i18n: form.viaPointShortName,
    },
  });

  const mapChangesToVariables = ({
    journeyPatternId,
    stopLabel,
    patch,
  }: EditChanges): PatchScheduledStopPointViaInfoMutationVariables => ({
    journeyPatternId,
    stopLabel,
    patch,
  });

  const executeMutation = (
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

export const useEditViaInfo = extendHook(useEditViaInfoHook);
