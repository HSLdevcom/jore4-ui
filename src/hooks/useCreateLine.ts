import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import {
  InsertRouteOneMutationVariables,
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
  RouteLineSetInput,
  useInsertLineOneMutation,
} from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

interface CreateParams {
  form: FormState;
}
interface CreateChanges {
  input: RouteLineInsertInput;
}

export const mapFormToInput = (
  state: FormState,
): RouteLineSetInput | RouteLineInsertInput => {
  const input = {
    label: state.label,
    name_i18n: state.finnishName,
    primary_vehicle_mode:
      state.primaryVehicleMode as ReusableComponentsVehicleModeEnum,
    priority: state.priority,
    validity_start: mapDateInputToValidityStart(state.validityStart),
    validity_end: mapDateInputToValidityEnd(
      state.validityEnd,
      state.indefinite,
    ),
  };
  return input;
};

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const { checkLineValidity } = useCheckValidityAndPriorityConflicts();

  const prepareCreate = async ({ form }: CreateParams) => {
    const input = mapFormToInput(form);
    await checkLineValidity({
      label: form.label,
      priority: form.priority,
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
