import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../mappers';

export type TimetableState = {
  readonly showArrivalTimes: boolean;
  readonly showAllValid: boolean;
  readonly settings: {
    readonly isOccasionalSubstitutePeriodFormDirty: boolean;
    readonly isCommonSubstitutePeriodFormDirty: boolean;
  };
};

type IState = StoreType<TimetableState>;

const initialState: IState = {
  showArrivalTimes: false,
  showAllValid: false,
  settings: {
    isOccasionalSubstitutePeriodFormDirty: false,
    isCommonSubstitutePeriodFormDirty: false,
  },
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
    setIsOccasionalSubstitutePeriodFormDirty: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.isOccasionalSubstitutePeriodFormDirty = action.payload;
    },
    setIsCommonSubstitutePeriodFormDirty: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.settings.isCommonSubstitutePeriodFormDirty = action.payload;
    },
  },
});

export const {
  setShowArrivalTimes: setShowArrivalTimesAction,
  setShowAllValid: setShowAllValidAction,
  setIsOccasionalSubstitutePeriodFormDirty:
    setIsOccasionalSubstitutePeriodFormDirtyAction,
  setIsCommonSubstitutePeriodFormDirty:
    setIsCommonSubstitutePeriodFormDirtyAction,
} = slice.actions;

export const timetableReducer = slice.reducer;
