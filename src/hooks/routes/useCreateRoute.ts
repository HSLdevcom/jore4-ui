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

interface CreateParams {
  form: Partial<RouteFormState>;
  stopIdsWithinRoute: UUID[];
  infraLinksAlongRoute: InfrastructureLinkAlongRoute[];
  startingStopId: UUID;
  finalStopId: UUID;
}

interface CreateChanges {
  input: InsertRouteOneMutationVariables;
  conflicts?: RouteRoute[];
}

const mapStopIdToScheduledStopPoint = (stopId: UUID, index: number) => ({
  scheduled_stop_point_id: stopId,
  scheduled_stop_point_sequence: index,
});
export const mapStopsToScheduledStopPoints = (stops: UUID[]) => {
  return {
    data: stops.map(mapStopIdToScheduledStopPoint),
  };
};

const mapRouteDetailsToInsertMutationVariables = (
  params: CreateParams,
): InsertRouteOneMutationVariables => {
  const {
    form,
    stopIdsWithinRoute,
    infraLinksAlongRoute,
    startingStopId,
    finalStopId,
  } = params;
  const input: InsertRouteOneMutationVariables = mapToObject({
    starts_from_scheduled_stop_point_id: startingStopId,
    ends_at_scheduled_stop_point_id: finalStopId,
    on_line_id: form.on_line_id,
    label: form.label,
    description_i18n: form.description_i18n,
    direction: form.direction,
    priority: form.priority,
    validity_start: mapDateInputToValidityStart(
      // form validation makes sure that 'validityStart' has a valid value at this point
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      form.validityStart!,
    ),
    validity_end: mapDateInputToValidityEnd(form.validityEnd, form.indefinite),
    // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
    infrastructure_links_along_route: {
      data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
    },
    route_journey_patterns: {
      data: {
        scheduled_stop_point_in_journey_patterns:
          mapStopsToScheduledStopPoints(stopIdsWithinRoute),
      },
    },
  });

  return input;
};

export const useCreateRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = useInsertRouteOneMutation();
  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();

  const prepareCreate = async (params: CreateParams) => {
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
  };
};
