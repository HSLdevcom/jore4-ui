import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import {
  Operation,
  resetDraftRouteGeometryAction,
  resetRouteCreatingAction,
  selectEditedRouteData,
  selectMapRouteEditor,
  setSelectedRouteIdAction,
  useAppDispatch,
  useAppSelector,
  useLoader,
} from '../../../../../redux';
import { isDateInRange } from '../../../../../time';
import { Priority } from '../../../../../types/enums';
import { showSuccessToast, showWarningToast } from '../../../../../utils';
import { RouteFormState } from '../../../../forms/route/RoutePropertiesForm.types';
import { hasBlockers } from '../../../../LinesAndRoutes/Common/SaveBlockers';
import { useMapUrlStateContext } from '../../../Utils/mapUrlState';
import { SNAPPING_LINE_LAYER_ID, removeRoute } from '../../Utils';
import { CreateChanges, useCreateRoute } from './useCreateRoute';
import { useDefaultErrorHandler } from './useDefaultErrorHandler';

export function useCreateRouteHelper() {
  const { t } = useTranslation();
  const defaultErrorHandler = useDefaultErrorHandler();
  const { current: map } = useMap();

  const {
    state: {
      filters: { observationDate },
    },
    setDisplayedRoute,
    setFlatUrlState,
  } = useMapUrlStateContext();

  const dispatch = useAppDispatch();

  const {
    editedRouteData: { lineInfo },
  } = useAppSelector(selectMapRouteEditor);

  const {
    infraLinks,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPattern,
    metaData: routeDetails,
  } = useAppSelector(selectEditedRouteData);

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const [pendingChanges, setPendingChanges] = useState<CreateChanges | null>(
    null,
  );

  const { prepareCreate, insertRouteMutation } = useCreateRoute();

  const onCommitCreateChanges = async (changes: CreateChanges) => {
    const result = await insertRouteMutation(changes);
    const newRoute = result.data?.insert_route_route_one;

    // Should never happen as insertRouteMutation itself will throw if the mutation failed.
    // But typings are not good.
    if (!newRoute) {
      throw new Error('Failed to insert route!');
    }

    showSuccessToast(t(($) => $.routes.saveSuccess));

    // Select created route
    dispatch(setSelectedRouteIdAction(newRoute.route_id));

    setDisplayedRoute(() => ({
      routeId: newRoute.route_id,
      lineLabel: null,
      routeLabels: [],
      routePriorities: [Priority.Standard, Priority.Temporary, Priority.Draft],
      showSelectedDaySituation: false,
    }));

    // // If created route is not valid at the selected observation date,
    // // change observation date to created route's validity start date
    // // so the user can see the freshly created route
    if (
      !isDateInRange(
        observationDate,
        newRoute.validity_start,
        newRoute.validity_end,
      )
    ) {
      setFlatUrlState((p) => ({
        ...p,
        observationDate:
          newRoute.validity_start ?? newRoute.validity_end ?? observationDate,
      }));
      showWarningToast(t(($) => $.filters.observationDateAdjusted));
    }

    // Reset map editor state and clear draft route visuals.
    dispatch(resetDraftRouteGeometryAction());
    dispatch(resetRouteCreatingAction());
    removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
  };

  const onDoCreate = async () => {
    try {
      setIsLoading(true);
      const changes = await prepareCreate({
        // At the point of saving a route, the form has been validated
        // and it contains all required values
        form: routeDetails as RouteFormState,
        stopsEligibleForJourneyPattern,
        includedStopLabels,
        journeyPatternStops: journeyPattern.stops,
        infraLinksAlongRoute: infraLinks ?? [],
        lineType: lineInfo?.type_of_line ?? null,
      });

      if (hasBlockers(changes)) {
        setPendingChanges(changes);
      } else {
        await onCommitCreateChanges(changes);
      }
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingCreateChanges: pendingChanges,
    onCancelCreate: () => setPendingChanges(null),
    onConfirmCreate: pendingChanges
      ? () => {
          setIsLoading(true);
          setPendingChanges(null);

          return onCommitCreateChanges(pendingChanges).finally(() =>
            setIsLoading(false),
          );
        }
      : null,
    onDoCreate,
  };
}
