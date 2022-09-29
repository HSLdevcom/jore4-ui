import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';

interface IState {
  isSelectingRoutesForExport: boolean;
  selectedRouteLabels: string[];
}

const initialState: IState = {
  isSelectingRoutesForExport: false,
  selectedRouteLabels: [],
};

const slice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    setIsSelectingRoutesForExport: (state, action: PayloadAction<boolean>) => {
      state.isSelectingRoutesForExport = action.payload;
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
    resetSelectedRoutes: (state) => {
      state.selectedRouteLabels = initialState.selectedRouteLabels;
    },
  },
});

export const {
  setIsSelectingRoutesForExport: setIsSelectingRoutesForExportAction,
  selectRouteLabel: selectRouteLabelAction,
  deselectRouteLabel: deselectRouteLabelAction,
  resetSelectedRoutes: resetSelectedRoutesAction,
} = slice.actions;

export const exportReducer = slice.reducer;
