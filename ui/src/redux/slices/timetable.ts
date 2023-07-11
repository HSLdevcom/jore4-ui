import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreType } from '../mappers';

export interface TimetableState {
  showArrivalTimes: boolean;
  showAllValid: boolean;
}

type IState = StoreType<TimetableState>;

const initialState: IState = {
  showArrivalTimes: false,
  showAllValid: false,
};

const slice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setShowArrivalTimes: (state, action: PayloadAction<boolean>) => {
      state.showArrivalTimes = action.payload;
    },
    setShowAllValid: (state, action: PayloadAction<boolean>) => {
      state.showAllValid = action.payload;
    },
  },
});

export const {
  setShowArrivalTimes: setShowArrivalTimesAction,
  setShowAllValid: setShowAllValidAction,
} = slice.actions;

export const timetableReducer = slice.reducer;
