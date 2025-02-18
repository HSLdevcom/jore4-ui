import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { EnrichedStopPlace } from '../../hooks';
import { StoreType, mapToStoreType } from '../mappers';

export type MapStopAreaEditor = {
  readonly selectedStopAreaId?: string;
  readonly editedStopAreaData?: EnrichedStopPlace;
  readonly isCreateStopAreaModeEnabled: boolean;
  readonly isMoveStopAreaModeEnabled: boolean;
};

type IState = StoreType<MapStopAreaEditor>;

const initialState: IState = {
  selectedStopAreaId: undefined,
  editedStopAreaData: undefined,
  isCreateStopAreaModeEnabled: false,
  isMoveStopAreaModeEnabled: false,
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
      ) => {
        state.editedStopAreaData = action.payload ?? undefined;
      },
      prepare: (stopArea: EnrichedStopPlace | undefined | null) => ({
        payload: stopArea ? mapToStoreType(stopArea) : undefined,
      }),
    },
    setIsCreateStopAreaModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopAreaModeEnabled = action.payload;
    },
    setIsMoveStopAreaModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMoveStopAreaModeEnabled = action.payload;
    },
    resetEnabledStopAreaModes: (state) => {
      state.isCreateStopAreaModeEnabled = false;
      state.isMoveStopAreaModeEnabled = false;
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedStopAreaId: setSelectedMapStopAreaIdAction,
  setEditedStopAreaData: setEditedStopAreaDataAction,
  setIsCreateStopAreaModeEnabled: setIsCreateStopAreaModeEnabledAction,
  setIsMoveStopAreaModeEnabled: setIsMoveStopAreaModeEnabledAction,
  resetEnabledStopAreaModes: resetEnabledStopAreaModesAction,
  reset: resetMapStopAreaEditorAction,
} = slice.actions;

export const mapStopAreaEditorReducer = slice.reducer;
