import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorDetails {
  details: string;
  additionalDetails?: string;
}

export interface ErrorListItem extends ErrorDetails {
  key: string;
  message: string;
}

interface IState {
  isOpen: boolean;
  errorModalTitle: string;
  errorList: ErrorListItem[];
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
    openErrorListModal: (
      state: IState,
      action: PayloadAction<{
        errorModalTitle: string;
        errorList: ErrorListItem[];
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
  openErrorListModal: openErrorListModalAction,
  closeErrorModal: closeErrorModalAction,
} = slice.actions;

export const errorModalReducer = slice.reducer;
