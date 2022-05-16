import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/line/LineForm';
import {
  GetLineDetailsWithRoutesByIdDocument,
  GetLineDetailsWithRoutesByIdQuery,
  GetLineDetailsWithRoutesByIdQueryVariables,
  PatchLineMutationVariables,
  RouteLine,
  RouteLineSetInput,
  usePatchLineMutation,
} from '../generated/graphql';
import { mapLineDetailsWithRoutesResult } from '../graphql';
import { MIN_DATE } from '../time';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../utils';
import { useValidateRoute } from './routes';
import { useAsyncQuery } from './useAsyncQuery';
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
  const { checkIsRouteValidityInsideLineValidity } = useValidateRoute();

  const [getLineWithRoutesById] = useAsyncQuery<
    GetLineDetailsWithRoutesByIdQuery,
    GetLineDetailsWithRoutesByIdQueryVariables
  >(GetLineDetailsWithRoutesByIdDocument);

  const validateLine = async ({ lineId, form }: EditParams) => {
    const lineResult = await getLineWithRoutesById({ line_id: lineId });
    const line = mapLineDetailsWithRoutesResult(lineResult);

    const routes = line?.line_routes;
    const conflictinRoutes: string[] = [];

    const lineValidityStart = mapDateInputToValidityStart(form.validityStart);
    const lineValidityEnd = mapDateInputToValidityEnd(
      form.validityEnd,
      form.indefinite,
    );

    routes?.forEach((route) => {
      try {
        checkIsRouteValidityInsideLineValidity(route, {
          validity_start: lineValidityStart,
          validity_end: lineValidityEnd,
        });
      } catch (error) {
        conflictinRoutes.push(route.label);
      }
    });

    if (conflictinRoutes.length) {
      throw new Error(
        `${t('lines.routesOutsideValidity')}: ${conflictinRoutes.join(', ')}`,
      );
    }
  };

  const prepareEdit = async ({ lineId, form }: EditParams) => {
    const input = mapFormToInput(form);

    await validateLine({ lineId, form });
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
