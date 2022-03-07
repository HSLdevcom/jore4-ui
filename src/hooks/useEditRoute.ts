import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/RoutePropertiesForm';
import { usePatchRouteMutation } from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showToast,
} from '../utils';

export const useEditRoute = () => {
  const { t } = useTranslation();
  const [patchRoute] = usePatchRouteMutation();

  const worker = async (
    routeId: UUID,
    state: FormState,
    onSuccess?: () => void,
  ) => {
    const { label, priority, validityStart, validityEnd, indefinite } = state;

    const variables = {
      route_id: routeId,
      ...mapToObject({
        description_i18n: state.description_i18n,
        label,
        on_line_id: state.on_line_id,
        priority,
        validity_start: mapDateInputToValidityStart(validityStart),
        validity_end: mapDateInputToValidityEnd(validityEnd, indefinite),
      }),
    };

    try {
      await patchRoute(mapToVariables(variables));

      showToast({ type: 'success', message: t('routes.saveSuccess') });

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
