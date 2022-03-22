import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import {
  PatchLineMutationVariables,
  RouteLine,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../generated/graphql';
import { showDangerToastWithError } from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';
import { mapFormToInput } from './useCreateLine';

interface EditParams {
  lineId: UUID;
  form: FormState;
}

interface EditChanges {
  lineId: UUID;
  patch: RouteLineSetInput;
  conflicts?: RouteLine[];
}

export const useEditLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchLineMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();

  const prepareEdit = async ({ lineId, form }: EditParams) => {
    const input = mapFormToInput(form);
    const conflicts = await getConflictingLines(
      {
        label: form.label,
        priority: form.priority,
        validityStart: input.validity_start,
        validityEnd: input.validity_end || undefined,
      },
      lineId,
    );

    const changes: EditChanges = {
      lineId,
      patch: input,
      conflicts,
    };

    return changes;
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchLineMutationVariables => ({
    line_id: changes.lineId,
    object: changes.patch,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editLineMutation: mutateFunction,
    defaultErrorHandler,
  };
};
