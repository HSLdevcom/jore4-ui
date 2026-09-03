import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import {
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectDraftLocation,
  selectDraftVehicleMode,
  selectSelectedStopId,
  setDraftLocationAction,
  setEditedStopAreaDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  useAppAction,
  useAppSelector,
  useLoader,
} from '../../../redux';
import { LoadingState } from '../../../types';
import { mapLngLatToPoint, mapPointToGeoJSON } from '../../../utils';
import { EditStoplayerRef, StopsRef } from '../refTypes';
import { MapStop, MapStopArea, MapTerminal } from '../Types';
import { useMapViewState } from '../Utils/useMapViewState';
import { CreateStopMarker } from './CreateStopMarker';
import { EditStopLayer } from './EditStopLayer';
import { ExistingStops } from './ExistingStops';
import {
  useCheckIsLocationValidForStop,
  useDefaultErrorHandler,
} from './utils';

type StopsProps = {
  readonly areas: ReadonlyArray<MapStopArea>;
  readonly displayedRouteIds: ReadonlyArray<string>;
  readonly showRoute: boolean;
  readonly stops: ReadonlyArray<MapStop>;
  readonly terminals: ReadonlyArray<MapTerminal>;
};

export const StopsImpl: ForwardRefRenderFunction<StopsRef, StopsProps> = (
  { areas, displayedRouteIds, showRoute, stops, terminals },
  ref,
) => {
  const [mapViewState, setMapViewState] = useMapViewState();

  const selectedStopId = useAppSelector(selectSelectedStopId);
  const draftLocation = useAppSelector(selectDraftLocation);
  const draftVehicleMode = useAppSelector(selectDraftVehicleMode);

  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);
  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setDraftStopLocation = useAppAction(setDraftLocationAction);

  const editStopLayerRef = useRef<EditStoplayerRef>(null);

  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const { setLoadingState: setFetchStopsLoadingState } = useLoader(
    Operation.FetchStops,
  );

  const checkIsLocationValidForStop = useCheckIsLocationValidForStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  const handleStopAction = async (
    e: MapLayerMouseEvent,
    stopState: MapEntityEditorViewState,
  ) => {
    setFetchStopsLoadingState(LoadingState.HighPriority);

    try {
      const stopLocation = mapLngLatToPoint(e.lngLat.toArray());
      await checkIsLocationValidForStop(mapPointToGeoJSON(stopLocation));

      setDraftStopLocation({
        latitude: stopLocation.latitude,
        longitude: stopLocation.longitude,
      });
      setMapViewState({ stops: stopState });
    } catch (err) {
      defaultErrorHandler(err as Error);
    }

    setFetchStopsLoadingState(LoadingState.NotLoading);
  };

  useImperativeHandle(ref, () => ({
    onCreateStop: async (e: MapLayerMouseEvent) =>
      handleStopAction(e, MapEntityEditorViewState.CREATE),
    onCopyStop: async (e: MapLayerMouseEvent) =>
      handleStopAction(e, MapEntityEditorViewState.COPY),
    onMoveStop: async (e: MapLayerMouseEvent) =>
      editStopLayerRef.current?.onMoveStop(e),
  }));

  const onPopupClose = () => {
    setSelectedStopId(undefined);
    setDraftStopLocation(undefined);
    setSelectedMapStopAreaId(undefined);
    setEditedStopAreaData(undefined);
  };

  const onEditingFinished = async (netexId: string | null) => {
    // the newly created stop should become a regular stop from a draft
    // also, the recently edited stop's data is refetched
    setDraftStopLocation(undefined);
    if (netexId) {
      setSelectedStopId(netexId);
      setMapViewState({ stops: MapEntityEditorViewState.POPUP });
    }
    setIsLoadingSaveStop(false);
  };

  const onCancelMoveOrPlacement = () => {
    setMapViewState({
      stops: selectedStopId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    });
  };

  if (
    isEditorOpen(mapViewState.stopAreas) ||
    isEditorOpen(mapViewState.terminals)
  ) {
    return null;
  }

  return (
    <>
      <ExistingStops
        areas={areas}
        displayedRouteIds={displayedRouteIds}
        showRoute={showRoute}
        stops={stops}
        terminals={terminals}
      />

      {/* Display edited stop + its editor components */}
      {(selectedStopId ?? draftLocation) && (
        <EditStopLayer
          ref={editStopLayerRef}
          selectedStopId={selectedStopId ?? null}
          draftLocation={draftLocation ?? null}
          draftVehicleMode={draftVehicleMode ?? null}
          onEditingFinished={onEditingFinished}
          onPopupClose={onPopupClose}
        />
      )}

      {/* Display hovering bus stop while in create mode */}
      {isPlacingOrMoving(mapViewState.stops) && (
        <CreateStopMarker
          onCancel={onCancelMoveOrPlacement}
          vehicleMode={draftVehicleMode ?? null}
        />
      )}
    </>
  );
};
export const Stops = forwardRef(StopsImpl);
