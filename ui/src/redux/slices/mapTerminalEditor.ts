import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EnrichedParentStopPlace } from '../../types';
import { StoreType, mapToStoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapTerminalEditorState = {
  readonly selectedTerminalId?: string;
  readonly editedTerminalData?: EnrichedParentStopPlace;
  readonly viewState: MapEntityEditorViewState;
};

const initialState: StoreType<MapTerminalEditorState> = {
  selectedTerminalId: undefined,
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
      ) => ({
        ...state,
        editedTerminalData: action.payload,
      }),
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
  setMapTerminalViewState: setMapTerminalViewStateAction,
  setEditedTerminalData: setEditedTerminalDataAction,
  reset: resetMapTerminalEditorStateAction,
} = slice.actions;

export const mapTerminalEditorReducer = slice.reducer;
