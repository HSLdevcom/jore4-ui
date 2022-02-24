import React, { useContext, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { MapEditorContext } from '../../context/MapEditorContext';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsQuery,
  useRemoveStopMutation,
} from '../../generated/graphql';
import {
  getRouteStopIds,
  mapGetStopsResult,
  mapRoutesDetailsResult,
} from '../../graphql';
import { useEditStop, useExtractRouteFromFeature } from '../../hooks';
import { useFilterStops } from '../../hooks/useFilterStops';
import { RequiredKeys } from '../../types';
import { ConfirmationDialog } from '../../uiComponents';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
  removeFromApolloCache,
  showDangerToast,
  showSuccessToast,
  showToast,
} from '../../utils';
import { mapStopDataToFormState } from '../forms/StopForm';
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
  const [popupInfo, setPopupInfo] = useState<DraftStop | undefined>();
  const [draftStop, setDraftStop] = useState<DraftStop | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const { t } = useTranslation();
  const { filter } = useFilterStops();

  const {
    dispatch: mapEditorDispatch,
    state: {
      selectedStopId,
      displayedRouteIds,
      editedRouteData,
      creatingNewRoute,
    },
  } = useContext(MapEditorContext);
  // TODO: Fetch only the stops visible on the map?
  const stopsResult = useGetStopsQuery({});
  const unfilteredStops = mapGetStopsResult(stopsResult);
  const stops = filter(unfilteredStops || []);

  const [removeStopMutation] = useRemoveStopMutation();
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

  const onRemoveStop = (id?: UUID) => {
    if (id) {
      // we are removing stop that is already stored to backend
      removeStopMutation({
        ...mapToVariables({ id }),
        // remove stop from cache after mutation
        update(cache) {
          removeFromApolloCache(cache, {
            scheduled_stop_point_id: id,
            __typename: 'service_pattern_scheduled_stop_point',
          });
        },
      });
    } else {
      // we are "removing" stop that isn't saved yet
      setDraftStop(undefined);
    }
    onClosePopup();
    setIsDeleting(false);
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
          onDelete={() => {
            setIsDeleting(true);
          }}
          onClose={onClosePopup}
        />
      )}
      {showEditForm && popupInfo && (
        <EditStopModal
          defaultValues={mapStopDataToFormState(popupInfo)}
          onCancel={() => setShowEditForm(false)}
          onClose={() => setShowEditForm(false)}
        />
      )}
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={() =>
          onRemoveStop(popupInfo?.scheduled_stop_point_id || undefined)
        }
        title={t('confirmDeleteStopDialog.title')}
        description={t('confirmDeleteStopDialog.description')}
        confirmText={t('confirmDeleteStopDialog.confirmText')}
        cancelText={t('confirmDeleteStopDialog.cancelText')}
      />
    </>
  );
});
