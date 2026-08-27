import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useDeleteRouteMutation } from '../../../generated/graphql';
import { showDangerToastWithError } from '../../../utils';

const GQL_DELETE_ROUTE = gql`
  mutation DeleteRoute($route_id: uuid!) {
    delete_route_route(where: { route_id: { _eq: $route_id } }) {
      returning {
        route_id
      }
    }
  }
`;

export function useDeleteRoute() {
  const { t } = useTranslation();
  const [deleteRouteMutation] = useDeleteRouteMutation();

  const deleteRoute = async (routeId?: UUID) => {
    if (!routeId) {
      throw new Error('Missing routeId');
    }

    return deleteRouteMutation({ variables: { route_id: routeId } });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
  };

  return { deleteRoute, defaultErrorHandler };
}
