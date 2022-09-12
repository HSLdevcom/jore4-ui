import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StopWithLocation } from '../../graphql';
import { mapToStoreType, StoreType } from '../mappers/storeType';

interface IState {
  selectedStopId?: UUID;
  editedStopData?: StoreType<StopWithLocation>;
  isCreateStopModeEnabled: boolean;
  isMoveStopModeEnabled: boolean;
}

const initialState: IState = {
  selectedStopId: undefined,
  editedStopData: undefined,
  isCreateStopModeEnabled: false,
  isMoveStopModeEnabled: false,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedStopId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedStopId = action.payload;
    },
    setIsCreateStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopModeEnabled = action.payload;
    },
    setIsMoveStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMoveStopModeEnabled = action.payload;
    },
    resetEnabledModes: (state) => {
      state.isMoveStopModeEnabled = false;
      state.isCreateStopModeEnabled = false;
    },
    setEditedStopData: {
      reducer: (
        state,
        action: PayloadAction<StoreType<StopWithLocation> | undefined>,
      ) => {
        state.editedStopData = action.payload;
      },
      prepare: (stop: StopWithLocation | undefined) => ({
        payload: stop ? mapToStoreType(stop) : undefined,
      }),
    },
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setIsCreateStopModeEnabled: setIsCreateStopModeEnabledAction,
  setIsMoveStopModeEnabled: setIsMoveStopModeEnabledAction,
  resetEnabledModes: resetEnabledModesAction,
  setEditedStopData: setEditedStopDataAction,
} = slice.actions;

export const mapReducer = slice.reducer;
