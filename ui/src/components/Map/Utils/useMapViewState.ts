import { createSelector } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  MapEntityEditorViewState,
  selectMapDepotStopViewState,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectMapTerminalViewState,
  setMapDepotStopViewStateAction,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setMapTerminalViewStateAction,
  useAppSelector,
} from '../../../redux';

type MapViewState = {
  readonly stops: MapEntityEditorViewState;
  readonly stopAreas: MapEntityEditorViewState;
  readonly terminals: MapEntityEditorViewState;
  readonly depotStops: MapEntityEditorViewState;
};

type SetMapViewStateFn = (changes: Partial<MapViewState>) => void;

const selectMapViewState = createSelector(
  selectMapStopViewState,
  selectMapStopAreaViewState,
  selectMapTerminalViewState,
  selectMapDepotStopViewState,
  (stops, stopAreas, terminals, depotStops) => ({
    stops,
    stopAreas,
    terminals,
    depotStops,
  }),
);

export function useMapViewState(): readonly [MapViewState, SetMapViewStateFn] {
  const state = useAppSelector(selectMapViewState);

  const dispatch = useDispatch();
  const setState = useCallback<SetMapViewStateFn>(
    (changes) => {
      if (changes.stops) {
        dispatch(setMapStopViewStateAction(changes.stops));
      }

      if (changes.stopAreas) {
        dispatch(setMapStopAreaViewStateAction(changes.stopAreas));
      }

      if (changes.terminals) {
        dispatch(setMapTerminalViewStateAction(changes.terminals));
      }

      if (changes.depotStops) {
        dispatch(setMapDepotStopViewStateAction(changes.depotStops));
      }
    },
    [dispatch],
  );

  return [state, setState];
}
