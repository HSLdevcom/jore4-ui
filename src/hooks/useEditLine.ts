import { useTranslation } from 'react-i18next';
import {
  PatchLineMutationVariables,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../generated/graphql';
import { showDangerToastWithError } from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

interface EditParams {
  lineId: UUID;
  patch: RouteLineSetInput;
}

interface EditChanges {
  lineId: UUID;
  patch: RouteLineSetInput;
}

export const useEditLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchLineMutation();
  const { checkLineValidity } = useCheckValidityAndPriorityConflicts();

  const prepareEdit = async ({ lineId, patch }: EditParams) => {
    const { label, priority } = patch;
    if (!label) throw new Error(`Expected string as "label", got "${label}"`);
    if (!priority) throw new Error(`Expected "priority", got "${priority}"`);

    await checkLineValidity(
      {
        label,
        priority,
        validityStart: patch.validity_start,
        validityEnd: patch.validity_end || undefined,
      },
      lineId,
    );

    const changes: EditChanges = {
      lineId,
      patch,
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
