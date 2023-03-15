import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';

interface IState {
  isSelectingRoutesForExport: boolean;
  selectedRouteUniqueLabels: string[];
}

const initialState: IState = {
  isSelectingRoutesForExport: false,
  selectedRouteUniqueLabels: [],
};

const slice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    setIsSelectingRoutesForExport: (state, action: PayloadAction<boolean>) => {
      state.isSelectingRoutesForExport = action.payload;
    },
    selectRouteUniqueLabel: (state: IState, action: PayloadAction<string>) => {
      const { selectedRouteUniqueLabels } = state;

      state.selectedRouteUniqueLabels = uniq([
        ...selectedRouteUniqueLabels,
        action.payload,
      ]);
    },
    deselectRouteUniqueLabel: (
      state: IState,
      action: PayloadAction<string>,
    ) => {
      const { selectedRouteUniqueLabels } = state;

      state.selectedRouteUniqueLabels = selectedRouteUniqueLabels.filter(
        (label) => label !== action.payload,
      );
    },
    selectRouteUniqueLabels: (
      state: IState,
      action: PayloadAction<string[]>,
    ) => {
      const { selectedRouteUniqueLabels } = state;

      state.selectedRouteUniqueLabels = uniq([
        ...selectedRouteUniqueLabels,
        ...action.payload,
      ]);
    },
    deselectRouteUniqueLabels: (
      state: IState,
      action: PayloadAction<string[]>,
    ) => {
      const { selectedRouteUniqueLabels } = state;

      state.selectedRouteUniqueLabels = selectedRouteUniqueLabels.filter(
        (uniqueLabel) => !action.payload.includes(uniqueLabel),
      );
    },
    resetSelectedRoutes: (state) => {
      state.selectedRouteUniqueLabels = initialState.selectedRouteUniqueLabels;
    },
  },
});

export const {
  setIsSelectingRoutesForExport: setIsSelectingRoutesForExportAction,
  selectRouteUniqueLabel: selectRouteUniqueLabelAction,
  deselectRouteUniqueLabel: deselectRouteUniqueLabelAction,
  selectRouteUniqueLabels: selectRouteUniqueLabelsAction,
  deselectRouteUniqueLabels: deselectRouteUniqueLabelsAction,
  resetSelectedRoutes: resetSelectedRoutesAction,
} = slice.actions;

export const exportReducer = slice.reducer;
