import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types';
import { StoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapDepotStopEditorState = {
  readonly viewState: MapEntityEditorViewState;
  readonly draftLocation?: Point;
  readonly selectedDepotStopId?: string;
};

type IState = StoreType<MapDepotStopEditorState>;

const initialState: IState = {
  viewState: MapEntityEditorViewState.NONE,
  draftLocation: undefined,
  selectedDepotStopId: undefined,
};

const slice = createSlice({
  name: 'mapDepotStopEditor',
  initialState,
  reducers: {
    setMapDepotStopViewState: (
      state,
      action: PayloadAction<MapEntityEditorViewState>,
    ) => {
      state.viewState = action.payload;
    },
    setDepotStopDraftLocation: (
      state,
      action: PayloadAction<StoreType<Point> | undefined>,
    ) => {
      state.draftLocation = action.payload;
    },
    setSelectedDepotStopId: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.selectedDepotStopId = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setMapDepotStopViewState: setMapDepotStopViewStateAction,
  setDepotStopDraftLocation: setDepotStopDraftLocationAction,
  setSelectedDepotStopId: setSelectedDepotStopIdAction,
  reset: resetMapDepotStopEditorStateAction,
} = slice.actions;

export const mapDepotStopEditorReducer = slice.reducer;
