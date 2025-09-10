import { useTranslation } from 'react-i18next';
import { useDeleteRouteMutation } from '../../../../generated/graphql';
import {
  mapToVariables,
  removeFromApolloCache,
  showDangerToastWithError,
} from '../../../../utils';

export const useDeleteRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useDeleteRouteMutation();

  const deleteRoute = async (routeId?: UUID) => {
    if (!routeId) {
      throw new Error('Missing routeId');
    }

    const result = await mutateFunction({
      ...mapToVariables({ route_id: routeId }),
      update(cache) {
        removeFromApolloCache(cache, {
          route_id: routeId,
          __typename: 'route_route',
        });
      },
    });
    return result;
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return { deleteRoute, defaultErrorHandler };
};
