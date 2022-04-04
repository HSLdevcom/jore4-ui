import { useTranslation } from 'react-i18next';
import { useDeleteRouteMutation } from '../../generated/graphql';
import { mapToVariables, showDangerToast, showSuccessToast } from '../../utils';

export const useDeleteRoute = () => {
  const { t } = useTranslation();
  const [deleteRoute] = useDeleteRouteMutation();

  const worker = async (routeId?: UUID) => {
    if (!routeId) throw new Error('Missing routeId');
    try {
      const result = await deleteRoute(mapToVariables({ route_id: routeId }));
      showSuccessToast(t('routes.deleteSuccess'));
      // TODO: remove also from Apollo's cache
      return result;
    } catch (err) {
      showDangerToast(`${t('errors.saveFailed')}, '${err}'`);
      throw err;
    }
  };

  return [worker];
};
