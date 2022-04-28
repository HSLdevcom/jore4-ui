import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/line/LineForm';
import {
  PatchLineMutationVariables,
  RouteLine,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../generated/graphql';
import { MIN_DATE } from '../time';
import { showDangerToastWithError } from '../utils';
import {
  LocalizedTextMutationInputs,
  useUpsertLocalizedText,
} from './localization';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';
import { mapFormToInput, mapFormToLocalizedTexts } from './useCreateLine';

interface EditParams {
  lineId: UUID;
  form: FormState;
}

interface EditChanges {
  lineId: UUID;
  patch: RouteLineSetInput;
  localizedTextsUpsertInput: LocalizedTextMutationInputs;
  conflicts?: RouteLine[];
}

export const useEditLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchLineMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();
  const { buildUpsertLocalizedTestsInput } = useUpsertLocalizedText();

  const prepareEdit = async ({ lineId, form }: EditParams) => {
    const input = mapFormToInput(form);
    const localizedTexts = mapFormToLocalizedTexts(form);
    const localizedTextsUpsertInput = await buildUpsertLocalizedTestsInput(
      localizedTexts,
    );
    const conflicts = await getConflictingLines(
      {
        label: form.label,
        priority: form.priority,
        validityStart: input.validity_start || MIN_DATE,
        validityEnd: input.validity_end || undefined,
      },
      lineId,
    );

    const changes: EditChanges = {
      lineId,
      patch: input,
      localizedTextsUpsertInput,
      conflicts,
    };

    return changes;
  };

  const mapEditChangesToVariables = (changes: EditChanges) => {
    const { toUpsert, onConflict, toDelete } =
      changes.localizedTextsUpsertInput;
    const variables: PatchLineMutationVariables = {
      lineId: changes.lineId,
      linePatch: changes.patch,
      localizedTextsToUpsert: toUpsert,
      localizedTextsOnConflict: onConflict,
      localizedTextsToDelete: toDelete,
    };
    return variables;
  };

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
