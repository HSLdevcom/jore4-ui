import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../mappers';

export type MapStopAreaEditor = {
  readonly selectedStopArea?: string;
};

type IState = StoreType<MapStopAreaEditor>;

const initialState: IState = {
  selectedStopArea: undefined,
};

const slice = createSlice({
  name: 'mapStopAreaEditor',
  initialState,
  reducers: {
    setSelectedStopAreaId: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.selectedStopArea = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setSelectedStopAreaId: setSelectedMapStopAreaIdAction,
  reset: resetMapStopAreaEditorAction,
} = slice.actions;

export const mapStopAreaEditorReducer = slice.reducer;
