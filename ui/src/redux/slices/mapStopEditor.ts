import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types';
import { StoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapStopEditorState = {
  readonly selectedStopId?: string;
  readonly draftLocation?: Point;
  readonly viewState: MapEntityEditorViewState;
};

type IState = StoreType<MapStopEditorState>;

const initialState: IState = {
  selectedStopId: undefined,
  draftLocation: undefined,
  viewState: MapEntityEditorViewState.NONE,
};

const slice = createSlice({
  name: 'mapStopEditor',
  initialState,
  reducers: {
    setSelectedStopId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedStopId = action.payload;
    },
    setDraftLocation: (
      state,
      action: PayloadAction<StoreType<Point> | undefined>,
    ) => {
      state.draftLocation = action.payload;
    },
    setMapStopViewState: (
      state,
      action: PayloadAction<MapEntityEditorViewState>,
    ) => {
      state.viewState = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setDraftLocation: setDraftLocationAction,
  setMapStopViewState: setMapStopViewStateAction,
  reset: resetMapStopEditorStateAction,
} = slice.actions;

export const mapStopEditorReducer = slice.reducer;
