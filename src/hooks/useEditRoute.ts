import { useTranslation } from 'react-i18next';
import { FormState } from '../components/forms/RoutePropertiesForm';
import { usePatchRouteMutation } from '../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showDangerToast,
  showSuccessToast,
} from '../utils';

const mapFormToMutation = (state: FormState) => {
  const { label, priority, validityStart, validityEnd, indefinite } = state;
  return mapToObject({
    description_i18n: state.description_i18n,
    label,
    on_line_id: state.on_line_id,
    priority,
    validity_start: mapDateInputToValidityStart(validityStart),
    validity_end: mapDateInputToValidityEnd(validityEnd, indefinite),
  });
};

export const useEditRoute = () => {
  const { t } = useTranslation();
  const [patchRoute] = usePatchRouteMutation();

  const worker = async (routeId: UUID, state: FormState) => {
    const variables = {
      route_id: routeId,
      ...mapFormToMutation(state),
    };

    try {
      const result = await patchRoute(mapToVariables(variables));
      showSuccessToast(t('routes.saveSuccess'));
      return result;
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
      throw err;
    }
  };

  return [worker];
};
