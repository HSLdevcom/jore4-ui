import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import {
  PatchLineMutationVariables,
  usePatchLineMutation,
} from '../generated/graphql';
import {
  mapToVariables,
  showDangerToastWithError,
  showSuccessToast,
} from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';
import { mapFormToMutation } from './useCreateLine';

export const useEditLine = () => {
  const { t } = useTranslation();
  const [patchLine] = usePatchLineMutation();
  const { checkLineValidity } = useCheckValidityAndPriorityConflicts();

  const worker = async (lineId: UUID, state: FormState) => {
    const variables: PatchLineMutationVariables = {
      line_id: lineId,
      ...mapFormToMutation(state),
    };

    try {
      await checkLineValidity(
        {
          label: state.label,
          priority: state.priority,
          validityStart: variables.object.validity_start,
          validityEnd: variables.object.validity_end || undefined,
        },
        lineId,
      );
      const result = await patchLine(mapToVariables(variables));
      showSuccessToast(t('lines.saveSuccess'));
      return result;
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
      throw err;
    }
  };

  return [worker];
};
