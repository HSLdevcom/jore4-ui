import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { MapEditorContext } from '../../context/MapEditorContext';
import {
  ReusableComponentsVehicleModeEnum,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsQuery,
  useRemoveStopMutation,
} from '../../generated/graphql';
import { mapGetStopsResult, mapRoutesDetailsResult } from '../../graphql';
import { useEditStop } from '../../hooks';
import { RequiredKeys } from '../../types';
import { ConfirmationDialog } from '../../uiComponents';
import {
  DirectionNotResolvedError,
  EditRouteTerminalStopsError,
  LinkNotResolvedError,
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  mapToVariables,
  removeFromApolloCache,
  showDangerToast,
  showSuccessToast,
  showToast,
} from '../../utils';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

// draft stops only can only have a few attributes filled when placed, the rest is filled within the form
type DraftStop = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'measured_location'
>;

export const getRouteStopIds = (route: RouteRoute) => {
  return route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns.map(
    (point) => point.scheduled_stop_point_id,
  );
};

export const Stops = React.forwardRef((props, ref) => {
  // TODO: We might want to move these to MapEditorContext
  const [popupInfo, setPopupInfo] = useState<DraftStop | undefined>();
  const [draftStop, setDraftStop] = useState<DraftStop | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [stopIdsWithinRoute, setStopIdsWithinRoute] = useState<UUID[]>([]);

  const { t } = useTranslation();

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
  const stops = mapGetStopsResult(stopsResult);
  const [removeStopMutation] = useRemoveStopMutation();
  const {
    prepareAndValidateEdit,
    mapEditChangesToMutationVariables,
    editStopMutation,
  } = useEditStop();

  const routesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds || [] }),
  );
  const routes = mapRoutesDetailsResult(routesResult);

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

  const onEditSuccess = () => {
    showSuccessToast(t('stops.editSuccess'));
  };

  const onEditFail = (err: Error) => {
    if (err instanceof LinkNotResolvedError) {
      showDangerToast(t('stops.fetchClosestLinkFailed'));
      return;
    }
    if (err instanceof DirectionNotResolvedError) {
      showDangerToast(t('stops.fetchDirectionFailed'));
      return;
    }
    if (err instanceof EditRouteTerminalStopsError) {
      showDangerToast(t('stops.cannotEditTerminalStops'));
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}, ${err.message}`);
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
      const changes = await prepareAndValidateEdit({
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
      const variables = mapEditChangesToMutationVariables(changes);
      await editStopMutation({ variables });

      onEditSuccess();
    } catch (err) {
      onEditFail(err as Error);
    }
  };

  useEffect(() => {
    // If editing/creating a route, show stops along edited/created route
    if (creatingNewRoute || editedRouteData.id) {
      setStopIdsWithinRoute(editedRouteData.stopIds || []);
    } else {
      const stopIds = routes?.flatMap((route) => getRouteStopIds(route)) || [];

      setStopIdsWithinRoute(stopIds);
    }
  }, [routes, creatingNewRoute, editedRouteData.stopIds, editedRouteData.id]);

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
          defaultValues={{
            finnishName: popupInfo.label || '',
            latitude: mapLngLatToPoint(popupInfo.measured_location.coordinates)
              .latitude,
            longitude: mapLngLatToPoint(popupInfo.measured_location.coordinates)
              .longitude,
          }}
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
