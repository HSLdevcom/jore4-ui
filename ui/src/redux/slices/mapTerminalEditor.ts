import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EnrichedParentStopPlace, Point } from '../../types';
import { StoreType, mapToStoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapTerminalEditorState = {
  readonly selectedTerminalId?: string;
  readonly draftLocation?: Point;
  readonly editedTerminalData?: EnrichedParentStopPlace;
  readonly viewState: MapEntityEditorViewState;
};

const initialState: MapTerminalEditorState = {
  selectedTerminalId: undefined,
  draftLocation: undefined,
  editedTerminalData: undefined,
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
    setEditedTerminalData: {
      reducer: (
        state,
        action: PayloadAction<StoreType<EnrichedParentStopPlace> | undefined>,
      ) => {
        state.editedTerminalData = action.payload ?? undefined;
      },
      prepare: (terminal: EnrichedParentStopPlace | undefined | null) => ({
        payload: terminal ? mapToStoreType(terminal) : undefined,
      }),
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
  setEditedTerminalData: setEditedTerminalDataAction,
  reset: resetMapTerminalEditorStateAction,
} = slice.actions;

export const mapTerminalEditorReducer = slice.reducer;
