import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import { useInsertLineOneMutation } from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../utils';

export const useCreateLine = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertLineOneMutation();

  const worker = async (state: FormState, onSuccess?: () => void) => {
    const variables = mapToObject({
      label: state.label,
      name_i18n: state.finnishName,
      primary_vehicle_mode: state.primaryVehicleMode,
      priority: state.priority,
      validity_start: mapDateInputToValidityStart(state.validityStart),
      validity_end: mapDateInputToValidityEnd(
        state.validityEnd,
        state.indefinite,
      ),
    });

    try {
      const result = await mutateFunction(mapToVariables(variables));

      showToast({ type: 'success', message: t('routes.saveSuccess') });
      // eslint-disable-next-line no-console
      console.log('Line created successfully.', result);

      onSuccess && onSuccess(); // eslint-disable-line no-unused-expressions
      return { result };
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
      return { err };
    }
  };

  return [worker];
};
