import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EnrichedStopPlace } from '../../types';
import { StoreType, mapToStoreType } from '../mappers';
import { MapEntityEditorViewState } from '../types';

export type MapStopAreaEditor = {
  readonly selectedStopAreaId?: string;
  readonly editedStopAreaData?: EnrichedStopPlace;
  readonly viewState: MapEntityEditorViewState;
};

type IState = StoreType<MapStopAreaEditor>;

const initialState: IState = {
  selectedStopAreaId: undefined,
  editedStopAreaData: undefined,
  viewState: MapEntityEditorViewState.NONE,
};

const slice = createSlice({
  name: 'mapStopAreaEditor',
  initialState,
  reducers: {
    setSelectedStopAreaId: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.selectedStopAreaId = action.payload;
    },
    setEditedStopAreaData: {
      reducer: (
        state,
        action: PayloadAction<StoreType<EnrichedStopPlace> | undefined>,
      ) => ({
        ...state,
        editedStopAreaData: action.payload,
      }),
      prepare: (stopArea: EnrichedStopPlace | undefined | null) => ({
        payload: stopArea ? mapToStoreType(stopArea) : undefined,
      }),
    },
    setMapStopAreaViewState: (
      state,
      action: PayloadAction<MapEntityEditorViewState>,
    ) => {
      state.viewState = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedStopAreaId: setSelectedMapStopAreaIdAction,
  setEditedStopAreaData: setEditedStopAreaDataAction,
  setMapStopAreaViewState: setMapStopAreaViewStateAction,
  reset: resetMapStopAreaEditorAction,
} = slice.actions;

export const mapStopAreaEditorReducer = slice.reducer;
