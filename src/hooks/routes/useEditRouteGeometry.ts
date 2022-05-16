import { useTranslation } from 'react-i18next';
import {
  UpdateRouteGeometryMutationVariables,
  useUpdateRouteGeometryMutation,
} from '../../generated/graphql';
import { mapInfraLinksAlongRouteToGraphQL } from '../../graphql';
import { mapToVariables, showDangerToastWithError } from '../../utils';
import {
  extractFirstAndLastStopFromStops,
  mapStopsToStopSequence,
  RouteGeometry,
  useCreateRoute,
} from './useCreateRoute';

interface EditParams {
  routeId: UUID;
  newGeometry: RouteGeometry;
}

interface EditChanges {
  patch: UpdateRouteGeometryMutationVariables;
}

/**
 * Hook for editing route's geometry (journey pattern and infrastructure links).
 * For editing route metadata (name, label, validity etc.),
 * use editRouteMetadata
 */
export const useEditRouteGeometry = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useUpdateRouteGeometryMutation();
  const { validateGeometry } = useCreateRoute();

  const mapRouteDetailsToUpdateMutationVariables = (
    routeId: UUID,
    routeGeometry: RouteGeometry,
  ) => {
    const { stopIdsWithinRoute, infraLinksAlongRoute } = routeGeometry;

    const { startingStopId, finalStopId } =
      extractFirstAndLastStopFromStops(stopIdsWithinRoute);

    const variables: UpdateRouteGeometryMutationVariables = {
      route_id: routeId,
      new_infrastructure_links: mapInfraLinksAlongRouteToGraphQL(
        infraLinksAlongRoute,
      ).map((link) => ({ ...link, route_id: routeId })),
      new_journey_pattern: {
        on_route_id: routeId,
        scheduled_stop_point_in_journey_patterns:
          mapStopsToStopSequence(stopIdsWithinRoute),
      },
      route_route: {
        starts_from_scheduled_stop_point_id: startingStopId,
        ends_at_scheduled_stop_point_id: finalStopId,
      },
    };

    return variables;
  };

  const prepareEdit = async ({ routeId, newGeometry }: EditParams) => {
    await validateGeometry(newGeometry);

    const input = mapRouteDetailsToUpdateMutationVariables(
      routeId,
      newGeometry,
    );

    const changes: EditChanges = {
      patch: input,
    };

    return changes;
  };

  const mapEditChangesToVariables = (changes: EditChanges) =>
    mapToVariables(changes.patch);

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareEditGeometry: prepareEdit,
    mapEditGeometryChangesToVariables: mapEditChangesToVariables,
    editRouteGeometryMutation: mutateFunction,
    defaultErrorHandler,
  };
};
