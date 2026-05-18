import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import {
  LineAllFieldsFragment,
  PatchLineMutationVariables,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../../../generated/graphql';
import { MIN_DATE } from '../../../time';
import { Priority } from '../../../types/enums';
import { showDangerToastWithError } from '../../../utils';
import { useCheckValidityAndPriorityConflicts } from '../../common/hooks/useCheckValidityAndPriorityConflicts';
import { FormState } from '../../forms/line/LineForm';
import {
  StopMetaTypeUpdateInfo,
  filterNeedUpdateByLineType,
  lineTypeAffectsMetatypes,
  resolveStopInfoByLine,
} from '../common/useUpdateStopRegistryStopMetatype';
import { mapFormToInput } from '../create-line/useCreateLine';
import { useValidateLine } from './useValidateLine';

type EditParams = {
  readonly lineId: UUID;
  readonly form: FormState;
};

export type EditLineChanges = {
  readonly lineId: UUID;
  readonly patch: RouteLineSetInput;
  readonly conflicts: ReadonlyArray<LineAllFieldsFragment>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
};

export const useEditLine = () => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [mutateFunction] = usePatchLineMutation();
  const { getConflictingLines } = useCheckValidityAndPriorityConflicts();
  const { validateLine } = useValidateLine();

  const prepareEdit = async ({
    lineId,
    form,
  }: EditParams): Promise<EditLineChanges> => {
    const input = mapFormToInput(form);

    const getConflicts = () =>
      getConflictingLines(
        {
          label: form.label,
          priority: form.priority,
          validityStart: input.validity_start ?? MIN_DATE,
          validityEnd: input.validity_end ?? undefined,
        },
        lineId,
      );

    const getStopsNeedingUpdate = async () => {
      if (
        form.priority < Priority.Draft && // Draft should not change the stop type.
        lineTypeAffectsMetatypes(form.typeOfLine)
      ) {
        const updatableStops = await resolveStopInfoByLine(client, lineId);
        return updatableStops.filter(
          filterNeedUpdateByLineType(form.typeOfLine),
        );
      }

      return [];
    };

    const [conflicts, stopsNeedingUpdate] = await Promise.all([
      getConflicts(),
      getStopsNeedingUpdate(),
      validateLine({ lineId, input }),
    ]);

    return { lineId, patch: input, conflicts, stopsNeedingUpdate };
  };

  const mapEditChangesToVariables = (
    changes: EditLineChanges,
  ): PatchLineMutationVariables => ({
    line_id: changes.lineId,
    object: changes.patch,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editLineMutation: mutateFunction,
    defaultErrorHandler,
  };
};
