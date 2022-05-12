import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  InsertRouteOneMutationVariables,
  RouteRoute,
  useInsertRouteOneMutation,
} from '../../generated/graphql';
import {
  InfrastructureLinkAlongRoute,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../graphql';
import { MIN_DATE } from '../../time';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showDangerToastWithError,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';

export interface RouteGeometry {
  stopIdsWithinRoute: UUID[];
  infraLinksAlongRoute: InfrastructureLinkAlongRoute[];
}
interface CreateParams {
  form: Partial<RouteFormState>;
  routeGeometry: RouteGeometry;
}

interface CreateChanges {
  input: InsertRouteOneMutationVariables;
  conflicts?: RouteRoute[];
}

const mapStopIdToStopInSequence = (stopId: UUID, index: number) => ({
  scheduled_stop_point_id: stopId,
  scheduled_stop_point_sequence: index,
});
export const mapStopsToStopSequence = (stops: UUID[]) => {
  return {
    data: stops.map(mapStopIdToStopInSequence),
  };
};

export const extractFirstAndLastStopFromStops = (
  stopIdsWithinRoute: UUID[],
) => {
  // TODO: These will be removed from schema, remove from here as well
  const startingStopId = stopIdsWithinRoute[0];
  const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

  return { startingStopId, finalStopId };
};

export const useCreateRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertRouteOneMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();

  const validateGeometry = ({
    stopIdsWithinRoute,
    infraLinksAlongRoute,
  }: RouteGeometry) => {
    if (
      !infraLinksAlongRoute ||
      !stopIdsWithinRoute ||
      stopIdsWithinRoute.length < 2
    ) {
      throw new Error(t('routes.tooFewStops'));
    }
  };

  const mapRouteDetailsToInsertMutationVariables = (
    params: CreateParams,
  ): InsertRouteOneMutationVariables => {
    const { form, routeGeometry } = params;

    const { stopIdsWithinRoute, infraLinksAlongRoute } = routeGeometry;

    const { startingStopId, finalStopId } =
      extractFirstAndLastStopFromStops(stopIdsWithinRoute);

    const input: InsertRouteOneMutationVariables = mapToObject({
      starts_from_scheduled_stop_point_id: startingStopId,
      ends_at_scheduled_stop_point_id: finalStopId,
      on_line_id: form.on_line_id,
      label: form.label,
      name_i18n: form.finnishName,
      direction: form.direction,
      priority: form.priority,
      validity_start: mapDateInputToValidityStart(
        // form validation makes sure that 'validityStart' has a valid value at this point
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        form.validityStart!,
      ),
      validity_end: mapDateInputToValidityEnd(
        form.validityEnd,
        form.indefinite,
      ),
      // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
      infrastructure_links_along_route: {
        data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
      },
      route_journey_patterns: {
        data: {
          scheduled_stop_point_in_journey_patterns:
            mapStopsToStopSequence(stopIdsWithinRoute),
        },
      },
    });

    return input;
  };

  const prepareCreate = async (params: CreateParams) => {
    validateGeometry(params.routeGeometry);

    const input = mapRouteDetailsToInsertMutationVariables(params);
    const conflicts = await getConflictingRoutes({
      // Form validation should make sure that label, priority and direction always exist.
      // For some reason form state is saved as Partial<> so we have to use non-null assertions here...
      label: params.form.label!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      priority: params.form.priority!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      validityStart: input.object.validity_start || MIN_DATE,
      validityEnd: input.object.validity_end || undefined,
      direction: params.form.direction!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    });

    const changes: CreateChanges = {
      input,
      conflicts,
    };

    return changes;
  };

  const mapCreateChangesToVariables = (changes: CreateChanges) =>
    mapToVariables(changes.input);

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareCreate,
    mapCreateChangesToVariables,
    insertRouteMutation: mutateFunction,
    defaultErrorHandler,
    validateGeometry,
  };
};
