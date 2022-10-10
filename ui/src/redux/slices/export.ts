import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';

interface IState {
  isSelecting: boolean;
  selectedRouteLabels: string[];
}

const initialState: IState = {
  isSelecting: false,
  selectedRouteLabels: [],
};

const slice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    setIsSelecting: (state, action: PayloadAction<boolean>) => {
      state.isSelecting = action.payload;
    },
    selectRouteLabel: (state: IState, action: PayloadAction<string>) => {
      const { selectedRouteLabels } = state;

      state.selectedRouteLabels = uniq([
        ...selectedRouteLabels,
        action.payload,
      ]);
    },
    deselectRouteLabel: (state: IState, action: PayloadAction<string>) => {
      const { selectedRouteLabels } = state;

      state.selectedRouteLabels = selectedRouteLabels.filter(
        (label) => label !== action.payload,
      );
    },
    selectRouteLabels: (state: IState, action: PayloadAction<string[]>) => {
      const { selectedRouteLabels } = state;

      state.selectedRouteLabels = uniq([
        ...selectedRouteLabels,
        ...action.payload,
      ]);
    },
    deselectRouteLabels: (state: IState, action: PayloadAction<string[]>) => {
      const { selectedRouteLabels } = state;

      state.selectedRouteLabels = selectedRouteLabels.filter(
        (label) => !action.payload.includes(label),
      );
    },
    resetSelectedRoutes: (state) => {
      state.selectedRouteLabels = [];
    },
  },
});

export const {
  setIsSelecting: setIsSelectingAction,
  selectRouteLabel: selectRouteLabelAction,
  deselectRouteLabel: deselectRouteLabelAction,
  selectRouteLabels: selectRouteLabelsAction,
  deselectRouteLabels: deselectRouteLabelsAction,
  resetSelectedRoutes: resetSelectedRoutesAction,
} = slice.actions;

export const exportReducer = slice.reducer;
