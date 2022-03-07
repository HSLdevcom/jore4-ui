import { useTranslation } from 'react-i18next';
import { useDeleteRouteMutation } from '../generated/graphql';
import { mapToVariables, showToast } from '../utils';

export const useDeleteRoute = () => {
  const { t } = useTranslation();
  const [deleteRoute] = useDeleteRouteMutation();

  const worker = async (routeId?: UUID, onSuccess?: () => void) => {
    if (!routeId) return;
    try {
      await deleteRoute(mapToVariables({ route_id: routeId }));

      showToast({ type: 'success', message: t('routes.deleteSuccess') });

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
