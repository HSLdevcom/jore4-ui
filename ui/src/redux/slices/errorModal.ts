import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ErrorDetails {
  details: string;
  additionalDetails?: string;
}

export interface ErrorListItem extends ErrorDetails {
  key: string;
  errorTitle: string;
}

interface IState {
  isOpen: boolean;
  errorModalTitle: string;
  // These are mutually exclusive. See actions below.
  singleErrorDetails?: ErrorDetails;
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
      state.singleErrorDetails = undefined; // Not used in this case.
      state.isOpen = true;
    },
    openSingleErrorModal: (
      state: IState,
      action: PayloadAction<{
        errorModalTitle: string;
        errorDetails: ErrorDetails;
      }>,
    ) => {
      state.errorModalTitle = action.payload.errorModalTitle;
      state.singleErrorDetails = action.payload.errorDetails;
      state.errorList = []; // Not used in this case.
      state.isOpen = true;
    },
    closeErrorModal: (state: IState) => {
      state.singleErrorDetails = undefined;
      state.errorList = [];
      state.isOpen = false;
    },
  },
});

export const {
  openErrorListModal: openErrorListModalAction,
  openSingleErrorModal: openSingleErrorModalAction,
  closeErrorModal: closeErrorModalAction,
} = slice.actions;

export const errorModalReducer = slice.reducer;
