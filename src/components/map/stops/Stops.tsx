import React, { useContext, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { MapEditorContext } from '../../../context/MapEditor';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsQuery,
} from '../../../generated/graphql';
import {
  getRouteStopIds,
  mapGetStopsResult,
  mapRoutesDetailsResult,
} from '../../../graphql';
import {
  DeleteChanges,
  useDeleteStop,
  useEditStop,
  useExtractRouteFromFeature,
  useGetDisplayedRoutes,
} from '../../../hooks';
import { useFilterStops } from '../../../hooks/useFilterStops';
import { RequiredKeys } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
  showDangerToast,
  showSuccessToast,
  showToast,
} from '../../../utils';
import { mapStopDataToFormState } from '../../forms/StopForm';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

// draft stops only can only have a few attributes filled when placed, the rest is filled within the form
type DraftStop = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'measured_location'
>;

export const Stops = React.forwardRef((props, ref) => {
  // TODO: We might want to move these to MapEditorContext
  const [popupInfo, setPopupInfo] = useState<DraftStop>();
  const [draftStop, setDraftStop] = useState<DraftStop>();
  const [deleteChanges, setDeleteChanges] = useState<DeleteChanges>();
  const [showEditForm, setShowEditForm] = useState(false);

  const { t } = useTranslation();
  const { filter } = useFilterStops();

  const {
    dispatch: mapEditorDispatch,
    state: { selectedStopId, editedRouteData, creatingNewRoute },
  } = useContext(MapEditorContext);
  const { displayedRouteIds } = useGetDisplayedRoutes();

  // TODO: Fetch only the stops visible on the map?
  const stopsResult = useGetStopsQuery({});
  const unfilteredStops = mapGetStopsResult(stopsResult);
  const stops = filter(unfilteredStops || []);

  const {
    prepareDelete,
    mapDeleteChangesToVariables,
    removeStop,
    defaultErrorHandler: deleteErrorHandler,
  } = useDeleteStop();
  const {
    prepareEdit,
    mapEditChangesToVariables,
    editStopMutation,
    defaultErrorHandler,
  } = useEditStop();

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds || [] }),
  );
  const routes = mapRoutesDetailsResult(routesResult);

  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  // If editing/creating a route, show stops along edited/created route,
  // otherwise show every stop belonging to visible routes
  const stopIdsWithinRoute =
    creatingNewRoute || editedRouteData.id
      ? mapRouteStopsToStopIds(editedRouteData.stops)
      : routes?.flatMap((route) => getRouteStopIds(route));

  const setSelectedStopId = (id?: UUID) => {
    mapEditorDispatch({
      type: 'setState',
      payload: {
        selectedStopId: id,
      },
    });
  };

  const onOpenPopup = (point: DraftStop) => {
    setPopupInfo(point);
    setSelectedStopId(point.scheduled_stop_point_id || undefined);
  };

  const onClosePopup = () => {
    setPopupInfo(undefined);
    setSelectedStopId(undefined);
  };

  useImperativeHandle(ref, () => ({
    onCreateStop: (e: MapEvent) => {
      const stop: DraftStop = {
        measured_location: mapLngLatToGeoJSON(e.lngLat),
      };

      setDraftStop(stop);
      onOpenPopup(stop);
    },
  }));

  const onStopEditingFinished = async (refetchStops: boolean) => {
    setShowEditForm(false);
    setDraftStop(undefined);
    setSelectedStopId(undefined);
    setDeleteChanges(undefined);

    // should we refetch stop data?
    if (refetchStops) {
      // the newly created stop should become a regular stop from a draft
      // also, the recently edited stop's data is refetched
      await stopsResult.refetch();
    }
  };

  const onShowRemoveStopConfirmDialog = async (stopId: UUID) => {
    // we are removing stop that is already stored to backend
    try {
      const changes = await prepareDelete({
        stopId,
      });

      setDeleteChanges(changes);
    } catch (err) {
      deleteErrorHandler(err as Error);
      await onStopEditingFinished(false);
    }
  };

  const onRemoveDraftStop = async () => {
    setDraftStop(undefined);
    await onStopEditingFinished(false);
  };

  const onRemoveStop = async (stopId?: UUID) => {
    if (stopId) {
      // we are removing stop that is already stored to backend
      await onShowRemoveStopConfirmDialog(stopId);
    } else {
      // we are removing a draft stop
      await onRemoveDraftStop();
    }
    setPopupInfo(undefined);
  };

  // we are removing stop that is already stored to backend
  const onRemovePersistedStop = async () => {
    try {
      if (!deleteChanges) {
        throw new Error('Missing deleteChanges');
      }

      const variables = mapDeleteChangesToVariables(deleteChanges);
      await removeStop(variables);

      showSuccessToast(t('stops.removeSuccess'));
    } catch (err) {
      deleteErrorHandler(err as Error);
    }
    await onStopEditingFinished(true);
  };

  const onStopDragEnd = async (event: CallbackEvent, stopId: UUID) => {
    const existingStop = stops?.find(
      (item) => item.scheduled_stop_point_id === stopId,
    );
    if (!existingStop) {
      showToast({
        type: 'danger',
        message: 'Something went wrong when trying to move stop',
      });
      return;
    }

    try {
      const changes = await prepareEdit({
        stopId,
        patch: {
          measured_location: mapLngLatToGeoJSON(event.lngLat),
        },
      });
      if (changes.deleteStopFromRoutes.length > 0) {
        const deletedFromRoutes = changes.deleteStopFromRoutes
          .map((item) => item.label)
          .join(', ');
        showDangerToast(
          `This stop is now removed from the following routes: ${deletedFromRoutes}`,
        );
      }
      const variables = mapEditChangesToVariables(changes);
      await editStopMutation({ variables });

      showSuccessToast(t('stops.editSuccess'));
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  // TODO improve the confirmation dialog when Design has iterated on how this should look like
  const buildDeleteConfirmationText = (changes: DeleteChanges) => {
    const deletedStopText = t('confirmDeleteStopDialog.description', {
      stopLabel: changes.deletedStop.label,
    });
    const confirmationTextParts: string[] = [deletedStopText];

    // if stop is deleted from some routes, list them
    if (changes.deleteStopFromRoutes.length > 0) {
      const routeLabels = changes.deleteStopFromRoutes.map(
        (item) => item.label,
      );
      const removedRoutesText = t('confirmDeleteStopDialog.removedFromRoutes', {
        routeLabels,
      });
      confirmationTextParts.push(removedRoutesText);
    }

    return confirmationTextParts.join('<br/><br/>');
  };

  return (
    <>
      {stops?.map((item) => {
        const point = mapLngLatToPoint(item.measured_location.coordinates);
        return (
          <Stop
            key={item.scheduled_stop_point_id}
            selected={item.scheduled_stop_point_id === selectedStopId}
            longitude={point.longitude}
            latitude={point.latitude}
            onClick={() => onOpenPopup(item)}
            onDragEnd={(e) => onStopDragEnd(e, item.scheduled_stop_point_id)}
            draggable
            onVehicleRoute={
              stopIdsWithinRoute?.includes(item.scheduled_stop_point_id)
                ? ReusableComponentsVehicleModeEnum.Bus
                : undefined
            }
          />
        );
      })}
      {draftStop && (
        <Stop
          selected
          longitude={
            mapLngLatToPoint(draftStop.measured_location.coordinates).longitude
          }
          latitude={
            mapLngLatToPoint(draftStop.measured_location.coordinates).latitude
          }
          onClick={() => onOpenPopup(draftStop)}
          onDragEnd={() => null}
        />
      )}
      {popupInfo && (
        <StopPopup
          longitude={
            mapLngLatToPoint(popupInfo.measured_location.coordinates).longitude
          }
          latitude={
            mapLngLatToPoint(popupInfo.measured_location.coordinates).latitude
          }
          finnishName={popupInfo.label || ''}
          onEdit={() => {
            setShowEditForm(true);
          }}
          onDelete={() => onRemoveStop(popupInfo?.scheduled_stop_point_id)}
          onClose={onClosePopup}
        />
      )}
      {showEditForm && popupInfo && (
        <EditStopModal
          defaultValues={mapStopDataToFormState(popupInfo)}
          onCancel={() => onStopEditingFinished(false)}
          onClose={() => onStopEditingFinished(true)}
        />
      )}
      {deleteChanges && (
        <ConfirmationDialog
          isOpen={!!deleteChanges}
          onCancel={() => setDeleteChanges(undefined)}
          onConfirm={onRemovePersistedStop}
          title={t('confirmDeleteStopDialog.title')}
          description={buildDeleteConfirmationText(deleteChanges)}
          confirmText={t('confirmDeleteStopDialog.confirmText')}
          cancelText={t('confirmDeleteStopDialog.cancelText')}
        />
      )}
    </>
  );
});
