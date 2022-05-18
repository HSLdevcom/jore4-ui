import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setEditedStopDataAction, StoreStop } from '../actions/map';

interface IState {
  selectedStopId?: UUID;
  editedStopData?: StoreStop;
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
  },
  extraReducers(builder) {
    builder.addCase(
      setEditedStopDataAction,
      (state, action: PayloadAction<StoreStop | undefined>) => {
        state.editedStopData = action.payload;
      },
    );
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setIsCreateStopModeEnabled: setIsCreateStopModeEnabledAction,
} = slice.actions;

export const mapReducer = slice.reducer;
