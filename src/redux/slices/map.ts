import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StopWithLocation } from '../../graphql';

interface IState {
  selectedStopId?: UUID;
  editedStopData?: StopWithLocation;
  isCreateStopModeEnabled: boolean;
}

const initialState: IState = {
  selectedStopId: undefined,
  editedStopData: undefined,
  isCreateStopModeEnabled: false,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedStopId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedStopId = action.payload;
    },
    setEditedStopData: (
      state,
      action: PayloadAction<StopWithLocation | undefined>,
    ) => {
      state.editedStopData = action.payload;
    },
    setIsCreateStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopModeEnabled = action.payload;
    },
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setEditedStopData: setEditedStopDataAction,
  setIsCreateStopModeEnabled: setIsCreateStopModeEnabledAction,
} = slice.actions;

export const mapReducer = slice.reducer;
