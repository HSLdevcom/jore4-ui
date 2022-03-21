import { useTranslation } from 'react-i18next';
import {
  InsertRouteOneMutationVariables,
  RouteLineInsertInput,
  useInsertLineOneMutation,
} from '../generated/graphql';
import { showDangerToastWithError } from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

interface CreateParams {
  input: RouteLineInsertInput;
}
interface CreateChanges {
  input: RouteLineInsertInput;
}

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const { checkLineValidity } = useCheckValidityAndPriorityConflicts();

  const prepareCreate = async ({ input }: CreateParams) => {
    await checkLineValidity({
      label: input.label,
      priority: input.priority,
      validityStart: input.validity_start,
      validityEnd: input.validity_end || undefined,
    });

    const changes: CreateChanges = {
      input,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (
    changes: CreateChanges,
  ): InsertRouteOneMutationVariables => ({
    object: changes.input,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertLineMutation: mutateFunction,
    defaultErrorHandler,
  };
};
