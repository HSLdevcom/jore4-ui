import { useTranslation } from 'react-i18next';
import { FormState } from '../../components/forms/line/LineForm';
import {
  LineAllFieldsFragment,
  PatchLineMutationVariables,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../../generated/graphql';
import { MIN_DATE } from '../../time';
import { showDangerToastWithError } from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { mapFormToInput } from './useCreateLine';
import { useValidateLine } from './useValidateLine';

type EditParams = {
  readonly lineId: UUID;
  readonly form: FormState;
};

type EditChanges = {
  readonly lineId: UUID;
  readonly patch: RouteLineSetInput;
  readonly conflicts?: ReadonlyArray<LineAllFieldsFragment>;
};

export const useEditLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchLineMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();
  const { validateLine } = useValidateLine();

  const prepareEdit = async ({ lineId, form }: EditParams) => {
    const input = mapFormToInput(form);

    await validateLine({ lineId, input });
    const conflicts = await getConflictingLines(
      {
        label: form.label,
        priority: form.priority,
        validityStart: input.validity_start ?? MIN_DATE,
        validityEnd: input.validity_end ?? undefined,
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
