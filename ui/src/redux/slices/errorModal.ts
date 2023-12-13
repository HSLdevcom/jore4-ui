import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorItem {
  message: string;
  details: string;
  additionalDetails?: string;
}

interface IState {
  isOpen: boolean;
  errorModalTitle: string;
  errorList: ErrorItem[];
}

const initialState: IState = {
  isOpen: false,
  errorModalTitle: '',
  errorList: [],
};

const slice = createSlice({
  name: 'errorModal',
  initialState,
  reducers: {
    openErrorModal: (
      state: IState,
      action: PayloadAction<{
        errorModalTitle: string;
        errorList: ErrorItem[];
      }>,
    ) => {
      state.errorModalTitle = action.payload.errorModalTitle;
      state.errorList = action.payload.errorList;
      state.isOpen = true;
    },
    closeErrorModal: (state: IState) => {
      state.errorList = [];
      state.isOpen = false;
    },
  },
});

export const {
  openErrorModal: openErrorModalAction,
  closeErrorModal: closeErrorModalAction,
} = slice.actions;

export const errorModalReducer = slice.reducer;
