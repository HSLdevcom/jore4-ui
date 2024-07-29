import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StopRegistryGroupOfStopPlaces } from '../../generated/graphql';
import { StoreType, mapToStoreType } from '../mappers';

export type MapStopAreaEditor = {
  readonly selectedStopAreaId?: string;
  readonly editedStopAreaData?: StopRegistryGroupOfStopPlaces;
  readonly isCreateStopAreaModeEnabled: boolean;
};

type IState = StoreType<MapStopAreaEditor>;

const initialState: IState = {
  selectedStopAreaId: undefined,
  editedStopAreaData: undefined,
  isCreateStopAreaModeEnabled: false,
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
    setIsCreateStopAreaModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopAreaModeEnabled = action.payload;
    },
    resetEnabledStopAreaModes: (state) => {
      state.isCreateStopAreaModeEnabled = false;
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedStopAreaId: setSelectedMapStopAreaIdAction,
  setEditedStopAreaData: setEditedStopAreaDataAction,
  setIsCreateStopAreaModeEnabled: setIsCreateStopAreaModeEnabledAction,
  resetEnabledStopAreaModes: resetEnabledStopAreaModesAction,
  reset: resetMapStopAreaEditorAction,
} = slice.actions;

export const mapStopAreaEditorReducer = slice.reducer;
