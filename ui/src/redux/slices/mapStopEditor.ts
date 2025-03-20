import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreType } from '../mappers/storeType';

export type EditedMapStopData =
  | { type: 'id' }
  | { type: 'draft'; latitude: number; longitude: number };

export interface MapStopEditorState {
  selectedStopId?: string;
  editedStopData?: EditedMapStopData;
  isCreateStopModeEnabled: boolean;
  isMoveStopModeEnabled: boolean;
}

type IState = StoreType<MapStopEditorState>;

const initialState: IState = {
  selectedStopId: undefined,
  editedStopData: undefined,
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
    setEditedStopData: (
      state,
      action: PayloadAction<StoreType<EditedMapStopData> | undefined>,
    ) => {
      state.editedStopData = action.payload;
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
  setEditedStopData: setEditedStopDataAction,
  reset: resetMapStopEditorStateAction,
} = slice.actions;

export const mapStopEditorReducer = slice.reducer;
