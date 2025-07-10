import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';

type IState = {
  readonly isSelectingRoutesForExport: boolean;
  readonly selectedRows: string[];
};

const initialState: IState = {
  isSelectingRoutesForExport: false,
  selectedRows: [],
};

const slice = createSlice({
  name: 'export',
  initialState,
  reducers: {
    setIsSelectingRoutesForExport: (state, action: PayloadAction<boolean>) => {
      state.isSelectingRoutesForExport = action.payload;
    },
    selectRow: (state, action: PayloadAction<string>) => {
      const { selectedRows: selectedRoutes } = state;
      state.selectedRows = [...selectedRoutes, action.payload];
    },
    deselectRow: (state, action: PayloadAction<string>) => {
      const { selectedRows } = state;
      state.selectedRows = selectedRows.filter((id) => id !== action.payload);
    },
    selectRows: (state, action: PayloadAction<string[]>) => {
      const { selectedRows } = state;
      // If we are selecting rows with "Select all", we need to take uniq
      // to avoid adding the already checked rows again
      state.selectedRows = uniq([...selectedRows, ...action.payload]);
    },
    resetSelectedRows: (state) => {
      state.selectedRows = initialState.selectedRows;
    },
  },
});

export const {
  setIsSelectingRoutesForExport: setIsSelectingRoutesForExportAction,
  selectRow: selectRowAction,
  deselectRow: deselectRowAction,
  selectRows: selectRowsAction,
  resetSelectedRows: resetSelectedRowsAction,
} = slice.actions;

export const exportReducer = slice.reducer;
