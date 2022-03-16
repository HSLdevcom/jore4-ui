import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import {
  InsertRouteOneMutationVariables,
  ReusableComponentsVehicleModeEnum,
  RouteLineInsertInput,
  useInsertLineOneMutation,
} from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showDangerToastWithError,
  showSuccessToast,
} from '../utils';
import { useCheckValidityAndPriorityConflicts } from './useCheckValidityAndPriorityConflicts';

export const mapFormToMutation = (
  state: FormState,
): InsertRouteOneMutationVariables => {
  const mutation: RouteLineInsertInput = {
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
  return mapToObject(mutation);
};

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();
  const { checkLineValidity } = useCheckValidityAndPriorityConflicts();

  const worker = async (state: FormState) => {
    const variables = mapFormToMutation(state);

    try {
      await checkLineValidity({
        label: state.label,
        priority: state.priority,
        validityStart: variables.object.validity_start,
        validityEnd: variables.object.validity_end || undefined,
      });
      const result = await mutateFunction(mapToVariables(variables));
      showSuccessToast(t('routes.saveSuccess'));
      return result;
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
      throw err;
    }
  };

  return [worker];
};
