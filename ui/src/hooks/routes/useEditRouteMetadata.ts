import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  PatchRouteMutationVariables,
  RouteAllFieldsFragment,
  RouteRoute,
  RouteRouteSetInput,
  ServicePatternScheduledStopPoint,
  useGetScheduledStopsOnRouteAsyncQuery,
  usePatchRouteMutation,
} from '../../generated/graphql';
import { mapToISODate, MIN_DATE } from '../../time';
import { Priority } from '../../types/Priority';
import { RouteDirection } from '../../types/RouteDirection';
import {
  defaultLocalizedString,
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  removeFromApolloCache,
  showDangerToastWithError,
} from '../../utils';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useValidateRoute } from './useValidateRoute';

interface EditParams {
  routeId: UUID;
  form: RouteFormState;
}

interface EditChanges {
  routeId: UUID;
  patch: RouteRouteSetInput;
  conflicts?: RouteRoute[];
}

interface RouteStatusParams {
  routeId: UUID;
  oldPriority: Priority;
  form: RouteFormState;
}

interface RouteDraftStops {
  routeId: UUID;
  stops?: ServicePatternScheduledStopPoint[];
}

export const mapRouteFormToInput = (state: RouteFormState) => {
  const { label, priority, validityStart, validityEnd, indefinite } = state;
  const mutation = {
    name_i18n: { fi_FI: state.finnishName },
    label,
    on_line_id: state.onLineId,
    direction: state.direction,
    priority,
    validity_start: mapDateInputToValidityStart(validityStart),
    validity_end: mapDateInputToValidityEnd(validityEnd, indefinite),
    origin_name_i18n: defaultLocalizedString(state.origin?.name),
    origin_short_name_i18n: defaultLocalizedString(state.origin?.shortName),
    destination_name_i18n: defaultLocalizedString(state.destination?.name),
    destination_short_name_i18n: defaultLocalizedString(
      state.destination?.shortName,
    ),
  };
  return mutation;
};

export const mapRouteToFormState = (
  route: RouteAllFieldsFragment,
): RouteFormState => ({
  finnishName: route.name_i18n?.fi_FI || '',
  label: route.label,
  onLineId: route.on_line_id,
  direction: route.direction as RouteDirection,
  priority: route.priority,
  validityStart: mapToISODate(route.validity_start) || '',
  validityEnd: mapToISODate(route.validity_end) || '',
  indefinite: !route.validity_end,
  origin: {
    name: defaultLocalizedString(route.origin_name_i18n),
    shortName: defaultLocalizedString(route.origin_short_name_i18n),
  },
  destination: {
    name: defaultLocalizedString(route.destination_name_i18n),
    shortName: defaultLocalizedString(route.destination_short_name_i18n),
  },
});

/**
 * Hook for editing route's metadata.
 * For editing route geometry (journey pattern and infrastructure links),
 * use editRouteGeometry
 */
export const useEditRouteMetadata = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchRouteMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const { validateMetadata } = useValidateRoute();
  const [getScheduledStopsOnRoute] = useGetScheduledStopsOnRouteAsyncQuery();

  const prepareEdit = async ({ routeId, form }: EditParams) => {
    const input = mapRouteFormToInput(form);

    await validateMetadata(form);
    const conflicts = await getConflictingRoutes(
      {
        label: form.label,
        priority: form.priority,
        validityStart: input.validity_start || MIN_DATE,
        validityEnd: input.validity_end || undefined,
        direction: form.direction,
      },
      routeId,
    );

    const changes: EditChanges = {
      routeId,
      patch: input,
      conflicts,
    };

    return changes;
  };

  // Find all stops on route with draft priority, if the route changes priority from draft
  const findDraftStops = async ({
    routeId,
    oldPriority,
    form,
  }: RouteStatusParams) => {
    const input = mapRouteFormToInput(form);

    const stops: RouteDraftStops = {
      routeId,
      stops: undefined,
    };

    if (oldPriority === Priority.Draft && input.priority !== Priority.Draft) {
      const result = await getScheduledStopsOnRoute({
        routeId,
      });
      const mappedResult = result.data.journey_pattern_journey_pattern
        .flatMap((a) => a.scheduled_stop_point_in_journey_patterns)
        .flatMap((a) =>
          a.scheduled_stop_points.map(
            (b) => b as ServicePatternScheduledStopPoint,
          ),
        );
      stops.stops = mappedResult.filter(
        (stop) => stop.priority === Priority.Draft,
      );
    }

    return stops;
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchRouteMutationVariables => ({
    route_id: changes.routeId,
    object: changes.patch,
  });

  const editRouteMetadata = (variables: PatchRouteMutationVariables) => {
    return mutateFunction({
      variables,
      update(cache) {
        removeFromApolloCache(cache, {
          route_id: variables.route_id,
          __typename: 'route_route',
        });
      },
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareEditRouteMetadata: prepareEdit,
    findDraftStopsForNonDraftRoute: findDraftStops,
    mapEditRouteMetadataChangesToVariables: mapEditChangesToVariables,
    editRouteMetadata,
    defaultErrorHandler,
  };
};
