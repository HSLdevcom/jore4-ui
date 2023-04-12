import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreType } from '../mappers';

export interface TimetableState {
  showArrivalTimes: boolean;
}

type IState = StoreType<TimetableState>;

const initialState: IState = {
  showArrivalTimes: false,
};

const slice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setShowArrivalTimes: (state, action: PayloadAction<boolean>) => {
      state.showArrivalTimes = action.payload;
    },
  },
});

export const { setShowArrivalTimes: setShowArrivalTimesAction } = slice.actions;

export const timetableReducer = slice.reducer;
