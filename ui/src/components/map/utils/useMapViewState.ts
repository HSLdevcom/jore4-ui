import { createSelector } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  selectMapTerminalViewState,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setMapTerminalViewStateAction,
} from '../../../redux';

type MapViewState = {
  readonly stops: MapEntityEditorViewState;
  readonly stopAreas: MapEntityEditorViewState;
  readonly terminals: MapEntityEditorViewState;
};

type SetMapViewStateFn = (changes: Partial<MapViewState>) => void;

const selectMapVieState = createSelector(
  selectMapStopViewState,
  selectMapStopAreaViewState,
  selectMapTerminalViewState,
  (stops, stopAreas, terminals) => ({ stops, stopAreas, terminals }),
);

export function useMapViewState(): readonly [MapViewState, SetMapViewStateFn] {
  const state = useAppSelector(selectMapVieState);

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
    },
    [dispatch],
  );

  return [state, setState];
}
