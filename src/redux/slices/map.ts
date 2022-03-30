import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  selectedStopId?: UUID;
}

const initialState: IState = {
  selectedStopId: undefined,
};

const slice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setSelectedStopId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedStopId = action.payload;
    },
  },
});

export const { setSelectedStopId: setSelectedStopIdAction } = slice.actions;

export const mapReducer = slice.reducer;
