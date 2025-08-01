import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ErrorDetails = {
  readonly details: string;
  readonly additionalDetails?: string;
};

export type ErrorListItem = ErrorDetails & {
  readonly key: string;
  readonly errorTitle: string;
};

type IState = {
  readonly isOpen: boolean;
  readonly errorModalTitle: string;
  // These are mutually exclusive. See actions below.
  readonly singleErrorDetails?: ErrorDetails;
  readonly errorList: ReadonlyArray<ErrorListItem>;
};

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
      _state,
      action: PayloadAction<{
        errorModalTitle: string;
        errorList: ReadonlyArray<ErrorListItem>;
      }>,
    ) => ({
      errorModalTitle: action.payload.errorModalTitle,
      errorList: action.payload.errorList,
      singleErrorDetails: undefined, // Not used in this case.
      isOpen: true,
    }),
    openSingleErrorModal: (
      state,
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
    closeErrorModal: (state) => {
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
