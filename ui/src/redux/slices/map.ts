import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mapStopToStoreStop, StopWithLocation } from '../../graphql';
import { StoreType } from '../utils/mappers';

interface IState {
  selectedStopId?: UUID;
  editedStopData?: StoreType<StopWithLocation>;
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
    setIsCreateStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopModeEnabled = action.payload;
    },
    setEditedStopData: {
      reducer: (
        state,
        action: PayloadAction<StoreType<StopWithLocation> | undefined>,
      ) => {
        state.editedStopData = action.payload;
      },
      prepare: (stop: StopWithLocation | undefined) => ({
        payload: stop ? mapStopToStoreStop(stop) : undefined,
      }),
    },
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setIsCreateStopModeEnabled: setIsCreateStopModeEnabledAction,
  setEditedStopData: setEditedStopDataAction,
} = slice.actions;

export const mapReducer = slice.reducer;
