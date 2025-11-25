import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types';
import { StoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapStopEditorState = {
  readonly selectedStopId?: string;
  readonly draftLocation?: Point;
  readonly viewState: MapEntityEditorViewState;
  readonly copyStopId?: string;
};

type IState = StoreType<MapStopEditorState>;

const initialState: IState = {
  selectedStopId: undefined,
  draftLocation: undefined,
  viewState: MapEntityEditorViewState.NONE,
  copyStopId: undefined,
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
    setCopyStopId: (state, action: PayloadAction<string | undefined>) => {
      state.copyStopId = action.payload;
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
  setCopyStopId: setCopyStopIdAction,
  reset: resetMapStopEditorStateAction,
} = slice.actions;

export const mapStopEditorReducer = slice.reducer;
