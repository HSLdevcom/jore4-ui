import {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  LoadingState,
  MapEntityEditorViewState,
  Operation,
  isEditorOpen,
  selectSelectedTerminalId,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { none } from '../../../utils';
import { useGetTerminalDetails } from '../queries';
import { TerminalsRef } from '../refTypes';
import { MapTerminal } from '../types';
import { useMapViewState } from '../utils/useMapViewState';
import { Terminal } from './Terminal';
import { TerminalPopup } from './TerminalPopup';

function useLoadSelectedTerminalDetails(
  selectedTerminalId: string | null | undefined,
) {
  const { setLoadingState } = useLoader(Operation.FetchTerminalDetails);
  const { terminal, loading } = useGetTerminalDetails(selectedTerminalId);
  useEffect(() => {
    setLoadingState(
      loading ? LoadingState.MediumPriority : LoadingState.NotLoading,
    );
  }, [loading, setLoadingState]);

  return terminal;
}

type TerminalsProps = {
  readonly terminals: ReadonlyArray<MapTerminal>;
};

const TerminalsImpl: ForwardRefRenderFunction<TerminalsRef, TerminalsProps> = (
  { terminals },
  ref,
) => {
  const [mapViewState, setMapViewState] = useMapViewState();

  const selectedTerminalId = useAppSelector(selectSelectedTerminalId);

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);

  const terminalDetails = useLoadSelectedTerminalDetails(selectedTerminalId);

  useImperativeHandle(ref, () => ({
    onCreateTerminal() {
      throw new Error('Not implemented!');
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

  const notImplemented = () => {
    throw new Error('Not implemented!');
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

      {/* Move into EditTerminalLayer when that gets implemented,
          as-per stop and area implementations. */}
      {mapViewState.terminals === MapEntityEditorViewState.POPUP &&
        terminalDetails && (
          <TerminalPopup
            onClose={() => {
              setMapViewState({ terminals: MapEntityEditorViewState.NONE });
              setSelectedTerminalId(undefined);
            }}
            onDelete={notImplemented}
            onEdit={notImplemented}
            onMove={notImplemented}
            terminal={terminalDetails}
          />
        )}

      {/* EditTerminalLayer */}
      {/* CreateTerminalMarker */}
    </>
  );
};
export const Terminals = forwardRef(TerminalsImpl);
