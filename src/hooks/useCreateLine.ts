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
  showDangerToast,
  showSuccessToast,
} from '../utils';

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

  const worker = async (state: FormState) => {
    const variables = mapFormToMutation(state);

    try {
      const result = await mutateFunction(mapToVariables(variables));
      showSuccessToast(t('routes.saveSuccess'));
      return result;
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
      throw err;
    }
  };

  return [worker];
};
