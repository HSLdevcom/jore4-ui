import { MapLayerMouseEvent } from 'maplibre-gl';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  isPlacingOrMoving,
  selectEditedTerminalData,
  selectSelectedTerminalId,
  setEditedTerminalDataAction,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { mapLngLatToGeoJSON, none } from '../../../utils';
import { useCreateTerminal } from '../../stop-registry/terminals/useCreateTerminal';
import { useGetTerminalDetails } from '../queries';
import { EditTerminalLayerRef, TerminalsRef } from '../refTypes';
import { MapTerminal } from '../types';
import { useMapViewState } from '../utils/useMapViewState';
import { CreateTerminalMarker } from './CreateTerminalMarker';
import { EditTerminalLayer } from './EditTerminalLayer';
import { Terminal } from './Terminal';

function useFetchAndUpdateSelectedTerminalData() {
  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);

  const { setLoadingState } = useLoader(Operation.FetchTerminalDetails);
  const { terminal, loading } = useGetTerminalDetails(selectedTerminalId);

  useEffect(() => {
    setLoadingState(
      loading ? LoadingState.MediumPriority : LoadingState.NotLoading,
    );
  }, [loading, setLoadingState]);

  useEffect(() => {
    if (terminal) {
      setEditedTerminalData(terminal);
    }
  }, [terminal, setEditedTerminalData]);
}

type TerminalsProps = {
  readonly terminals: ReadonlyArray<MapTerminal>;
};

const TerminalsImpl: ForwardRefRenderFunction<TerminalsRef, TerminalsProps> = (
  { terminals },
  ref,
) => {
  const editTerminalLayerRef = useRef<EditTerminalLayerRef>(null);

  const [mapViewState, setMapViewState] = useMapViewState();

  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);

  const editedTerminalData = useAppSelector(selectEditedTerminalData);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);

  const { initializeTerminal } = useCreateTerminal();

  useFetchAndUpdateSelectedTerminalData();

  useImperativeHandle(ref, () => ({
    onCreateTerminal: async (e: MapLayerMouseEvent) => {
      const terminalLocation = mapLngLatToGeoJSON(e.lngLat.toArray());
      const initializedTerminal = initializeTerminal(terminalLocation);
      setEditedTerminalData(initializedTerminal);
      setMapViewState({ terminals: MapEntityEditorViewState.CREATE });
    },
    onMoveTerminal() {
      throw new Error('Not implemented!');
    },
  }));

  const onClick = (terminal: MapTerminal) => {
    if (none(isEditorOpen, mapViewState)) {
      if (!terminal.netex_id) {
        throw new Error('Terminal has no NetexID!');
      }

      setSelectedStopId(undefined);
      setSelectedTerminalId(terminal.netex_id);
      setSelectedMapStopAreaId(undefined);

      setMapViewState({
        stopAreas: MapEntityEditorViewState.NONE,
        stops: MapEntityEditorViewState.NONE,
        terminals: MapEntityEditorViewState.POPUP,
      });
    }
  };

  const onPopupClose = () => setSelectedTerminalId(undefined);

  const onCancelMoveOrPlacement = () => {
    setMapViewState({
      terminals: selectedTerminalId
        ? MapEntityEditorViewState.POPUP
        : MapEntityEditorViewState.NONE,
    });
  };

  return (
    <>
      {terminals.map((terminal) => (
        <Terminal
          key={terminal.id}
          mapTerminalViewState={mapViewState.terminals}
          onClick={onClick}
          selected={selectedTerminalId === terminal.netex_id}
          terminal={terminal}
        />
      ))}

      {editedTerminalData ? (
        <EditTerminalLayer
          ref={editTerminalLayerRef}
          editedTerminal={editedTerminalData}
          onPopupClose={onPopupClose}
        />
      ) : null}

      {isPlacingOrMoving(mapViewState.terminals) && (
        <CreateTerminalMarker onCancel={onCancelMoveOrPlacement} />
      )}
    </>
  );
};
export const Terminals = forwardRef(TerminalsImpl);
