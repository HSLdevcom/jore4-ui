import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types';
import { StoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapTerminalEditorState = {
  readonly selectedTerminalId?: string;
  readonly draftLocation?: Point;
  readonly viewState: MapEntityEditorViewState;
};

const initialState: MapTerminalEditorState = {
  selectedTerminalId: undefined,
  draftLocation: undefined,
  viewState: MapEntityEditorViewState.NONE,
};

const slice = createSlice({
  name: 'mapTerminalEditor',
  initialState,
  reducers: {
    setSelectedTerminalId: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.selectedTerminalId = action.payload;
    },
    setTerminalDraftLocation: (
      state,
      action: PayloadAction<StoreType<Point> | undefined>,
    ) => {
      state.draftLocation = action.payload;
    },
    setMapTerminalViewState: (
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
  setSelectedTerminalId: setSelectedTerminalIdAction,
  setTerminalDraftLocation: setTerminalDraftLocationAction,
  setMapTerminalViewState: setMapTerminalViewStateAction,
  reset: resetMapTerminalEditorStateAction,
} = slice.actions;

export const mapTerminalEditorReducer = slice.reducer;
