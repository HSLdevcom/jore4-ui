import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types';
import { StoreType } from '../mappers/storeType';

export interface MapStopEditorState {
  selectedStopId?: string;
  draftLocation?: Point;
  isCreateStopModeEnabled: boolean;
  isMoveStopModeEnabled: boolean;
}

type IState = StoreType<MapStopEditorState>;

const initialState: IState = {
  selectedStopId: undefined,
  draftLocation: undefined,
  isCreateStopModeEnabled: false,
  isMoveStopModeEnabled: false,
};

const slice = createSlice({
  name: 'mapStopEditor',
  initialState,
  reducers: {
    setSelectedStopId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedStopId = action.payload;
    },
    setIsCreateStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isCreateStopModeEnabled = action.payload;
    },
    setIsMoveStopModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.isMoveStopModeEnabled = action.payload;
    },
    resetEnabledModes: (state) => {
      state.isMoveStopModeEnabled = false;
      state.isCreateStopModeEnabled = false;
    },
    setDraftLocation: (
      state,
      action: PayloadAction<StoreType<Point> | undefined>,
    ) => {
      state.draftLocation = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const {
  setSelectedStopId: setSelectedStopIdAction,
  setIsCreateStopModeEnabled: setIsCreateStopModeEnabledAction,
  setIsMoveStopModeEnabled: setIsMoveStopModeEnabledAction,
  resetEnabledModes: resetEnabledModesAction,
  setDraftLocation: setDraftLocationAction,
  reset: resetMapStopEditorStateAction,
} = slice.actions;

export const mapStopEditorReducer = slice.reducer;
