import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  isEditorOpen,
  selectSelectedTerminalId,
  setSelectedMapStopAreaIdAction,
  setSelectedStopIdAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { none } from '../../../utils';
import { TerminalsRef } from '../refTypes';
import { MapTerminal } from '../types';
import { useMapViewState } from '../utils/useMapViewState';
import { Terminal } from './Terminal';

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

      {/* EditTerminalLayer */}
      {/* CreateTerminalMarker */}
    </>
  );
};
export const Terminals = forwardRef(TerminalsImpl);
