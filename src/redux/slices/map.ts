import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StopWithLocation } from '../../graphql';

interface IState {
  selectedStopId?: UUID;
  editedStopData?: StopWithLocation;
}

const initialState: IState = {
  selectedStopId: undefined,
  editedStopData: undefined,
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
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setEditedStopData: setEditedStopDataAction,
} = slice.actions;

export const mapReducer = slice.reducer;
