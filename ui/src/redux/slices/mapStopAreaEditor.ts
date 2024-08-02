import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StopRegistryGroupOfStopPlaces } from '../../generated/graphql';
import { StoreType, mapToStoreType } from '../mappers';

export type MapStopAreaEditor = {
  readonly selectedStopAreaId?: string;
  readonly editedStopAreaData?: StopRegistryGroupOfStopPlaces;
};

type IState = StoreType<MapStopAreaEditor>;

const initialState: IState = {
  selectedStopAreaId: undefined,
  editedStopAreaData: undefined,
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
        action: PayloadAction<
          StoreType<StopRegistryGroupOfStopPlaces> | undefined
        >,
      ) => {
        state.editedStopAreaData = action.payload;
      },
      prepare: (stopArea: StopRegistryGroupOfStopPlaces | undefined) => ({
        payload: stopArea ? mapToStoreType(stopArea) : undefined,
      }),
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedStopAreaId: setSelectedMapStopAreaIdAction,
  setEditedStopAreaData: setEditedStopAreaDataAction,
  reset: resetMapStopAreaEditorAction,
} = slice.actions;

export const mapStopAreaEditorReducer = slice.reducer;
