import { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { MapFilterContext, setObservationDate } from '../../context/MapFilter';
import {
  InsertRouteOneMutationVariables,
  RouteRoute,
  UpdateRouteGeometryMutationVariables,
  useInsertRouteOneMutation,
  useUpdateRouteGeometryMutation,
} from '../../generated/graphql';
import {
  InfrastructureLinkAlongRoute,
  mapInfraLinksAlongRouteToGraphQL,
} from '../../graphql';
import {
  initializeMapEditorWithRoutesAction,
  selectMapEditor,
  stopDrawRouteAction,
} from '../../redux';
import { isDateInRange, MIN_DATE } from '../../time';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  showDangerToastWithError,
  showSuccessToast,
} from '../../utils';
import { useAppDispatch, useAppSelector } from '../redux';
import { useCheckValidityAndPriorityConflicts } from '../useCheckValidityAndPriorityConflicts';
import { useExtractRouteFromFeature } from '../useExtractRouteFromFeature';

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

const mapRouteDetailsToUpdateMutationVariables = (
  editingRouteId: UUID,
  stopIdsWithinRoute: UUID[],
  infraLinksAlongRoute: InfrastructureLinkAlongRoute[],
  startingStopId: UUID,
  finalStopId: UUID,
) => {
  const variables: UpdateRouteGeometryMutationVariables = {
    route_id: editingRouteId,
    new_infrastructure_links: mapInfraLinksAlongRouteToGraphQL(
      infraLinksAlongRoute,
    ).map((link) => ({ ...link, route_id: editingRouteId })),
    new_journey_pattern: {
      on_route_id: editingRouteId,
      scheduled_stop_point_in_journey_patterns:
        mapStopsToScheduledStopPoints(stopIdsWithinRoute),
    },
    route_route: {
      starts_from_scheduled_stop_point_id: startingStopId,
      ends_at_scheduled_stop_point_id: finalStopId,
    },
  };

  return mapToVariables(variables);
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

const mapCreateChangesToVariables = (changes: CreateChanges) =>
  mapToVariables(changes.input);

export const useSaveRoute = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [mutateFunction] = useInsertRouteOneMutation();
  const [updateRouteGeometryMutation] = useUpdateRouteGeometryMutation();

  const { getConflictingRoutes } = useCheckValidityAndPriorityConflicts();
  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  const [routeConflicts, setRouteConflicts] = useState<RouteRoute[]>([]);

  const {
    editedRouteData: {
      id: editingRouteId,
      infraLinks,
      stops: routeStops,
      metaData: routeDetails,
    },
  } = useAppSelector(selectMapEditor);

  const {
    state: { observationDate },
    dispatch: mapFilterDispatch,
  } = useContext(MapFilterContext);

  const prepareCreate = useCallback(
    async (params: CreateParams) => {
      const input = mapRouteDetailsToInsertMutationVariables(params);
      const conflicts = await getConflictingRoutes({
        // Form validation should make sure that label and priority always exist.
        // For some reason form state is saved as Partial<> so we have to use non-null assertions here...
        label: params.form.label!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        priority: params.form.priority!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
        validityStart: input.object.validity_start || MIN_DATE,
        validityEnd: input.object.validity_end || undefined,
      });

      const changes: CreateChanges = {
        input,
        conflicts,
      };

      return changes;
    },
    [getConflictingRoutes],
  );

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  const saveRoute = useCallback(async () => {
    const stopIdsWithinRoute = mapRouteStopsToStopIds(routeStops);

    if (!infraLinks || !stopIdsWithinRoute || stopIdsWithinRoute.length < 2) {
      throw new Error(t('routes.tooFewStopsOnRoute'));
    }

    const startingStopId = stopIdsWithinRoute[0];
    const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

    if (editingRouteId) {
      const variables = mapRouteDetailsToUpdateMutationVariables(
        editingRouteId,
        stopIdsWithinRoute,
        infraLinks,
        startingStopId,
        finalStopId,
      );

      await updateRouteGeometryMutation(variables);
    } else {
      if (!routeDetails) {
        return;
      }

      const changes = await prepareCreate({
        form: routeDetails,
        stopIdsWithinRoute,
        infraLinksAlongRoute: infraLinks,
        startingStopId,
        finalStopId,
      });
      if (changes.conflicts?.length) {
        setRouteConflicts(changes.conflicts);
        return;
      }
      const variables = mapCreateChangesToVariables(changes);

      const response = await mutateFunction(variables);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newRoute = response.data!.insert_route_route_one!;

      dispatch(initializeMapEditorWithRoutesAction([newRoute.route_id]));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const validityStart = newRoute.validity_start!;

      if (
        !isDateInRange(observationDate, validityStart, newRoute?.validity_end)
      ) {
        mapFilterDispatch(setObservationDate(validityStart));
        showSuccessToast(t('filters.observationDateAdjusted'));
      }

      dispatch(stopDrawRouteAction());
    }
  }, [
    dispatch,
    editingRouteId,
    infraLinks,
    mapFilterDispatch,
    mapRouteStopsToStopIds,
    mutateFunction,
    observationDate,
    prepareCreate,
    routeDetails,
    routeStops,
    t,
    updateRouteGeometryMutation,
  ]);

  return {
    saveRoute,
    conflicts: routeConflicts,
    setConflicts: setRouteConflicts,
    defaultErrorHandler,
  };
};
