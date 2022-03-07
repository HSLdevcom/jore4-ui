import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/LineForm';
import { usePatchLineMutation } from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../utils';

export const useEditLine = () => {
  const { t } = useTranslation();
  const [patchLine] = usePatchLineMutation();

  const worker = async (
    lineId: UUID,
    state: FormState,
    onSuccess?: () => void,
  ) => {
    const variables = {
      line_id: lineId,
      ...mapToObject({
        label: state.label,
        name_i18n: state.finnishName,
        primary_vehicle_mode: state.primaryVehicleMode,
        priority: state.priority,
        validity_start: mapDateInputToValidityStart(state.validityStart),
        validity_end: mapDateInputToValidityEnd(
          state.validityEnd,
          state.indefinite,
        ),
      }),
    };

    try {
      // patch the line in the backend
      await patchLine(mapToVariables(variables));

      showToast({ type: 'success', message: t('lines.saveSuccess') });

      // setHasFinishedEditing(true);
      onSuccess && onSuccess(); // eslint-disable-line no-unused-expressions
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

  return [worker];
};
