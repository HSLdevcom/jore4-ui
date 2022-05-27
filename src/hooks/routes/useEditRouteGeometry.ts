import { useTranslation } from 'react-i18next';
import {
  GetRoutesWithInfrastructureLinksDocument,
  JourneyPatternJourneyPatternInsertInput,
  RouteInfrastructureLinkAlongRouteInsertInput,
  UpdateRouteGeometryMutationVariables,
  useUpdateRouteGeometryMutation,
} from '../../generated/graphql';
import { mapInfraLinksAlongRouteToGraphQL, RouteGeometry } from '../../graphql';
import { showDangerToastWithError } from '../../utils';
import { mapStopsToStopSequence } from './useCreateRoute';
import { useValidateRoute } from './useValidateRoute';

interface EditParams {
  routeId: UUID;
  newGeometry: RouteGeometry;
}

interface EditChanges {
  routeId: UUID;
  newInfrastructureLinks: RouteInfrastructureLinkAlongRouteInsertInput[];
  newJourneyPattern: JourneyPatternJourneyPatternInsertInput;
}

/**
 * Hook for editing route's geometry (journey pattern and infrastructure links).
 * For editing route metadata (name, label, validity etc.),
 * use editRouteMetadata
 */
export const useEditRouteGeometry = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useUpdateRouteGeometryMutation();
  const { validateGeometry } = useValidateRoute();

  const prepareEdit = async ({ routeId, newGeometry }: EditParams) => {
    await validateGeometry(newGeometry);

    const { stopLabelsWithinRoute, infraLinksAlongRoute } = newGeometry;

    const changes: EditChanges = {
      routeId,
      newInfrastructureLinks: mapInfraLinksAlongRouteToGraphQL(
        infraLinksAlongRoute,
      ).map((link) => ({ ...link, route_id: routeId })),
      newJourneyPattern: {
        on_route_id: routeId,
        scheduled_stop_point_in_journey_patterns: mapStopsToStopSequence(
          stopLabelsWithinRoute,
        ),
      },
    };

    return changes;
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): UpdateRouteGeometryMutationVariables => ({
    route_id: changes.routeId,
    new_infrastructure_links: changes.newInfrastructureLinks,
    new_journey_pattern: changes.newJourneyPattern,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  const editRouteGeometryMutation = async (
    variables: UpdateRouteGeometryMutationVariables,
  ) => {
    await mutateFunction({
      variables,
      refetchQueries: [
        {
          query: GetRoutesWithInfrastructureLinksDocument,
          variables: { route_ids: [variables.route_id] },
        },
      ],
    });
  };

  return {
    prepareEditGeometry: prepareEdit,
    mapEditGeometryChangesToVariables: mapEditChangesToVariables,
    editRouteGeometryMutation,
    defaultErrorHandler,
  };
};
