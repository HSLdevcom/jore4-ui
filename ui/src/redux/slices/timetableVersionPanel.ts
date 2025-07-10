import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type IState = {
  readonly isOpen: boolean;
  readonly vehicleScheduleFrameId: UUID;
};

const initialState: IState = {
  isOpen: false,
  vehicleScheduleFrameId: '',
};

const slice = createSlice({
  name: 'timetableVersionPanel',
  initialState,
  reducers: {
    openVersionPanel: (
      state,
      action: PayloadAction<{
        vehicleScheduleFrameId: UUID;
      }>,
    ) => {
      state.vehicleScheduleFrameId = action.payload.vehicleScheduleFrameId;
      state.isOpen = true;
    },
    closeVersionPanel: (state) => {
      state.vehicleScheduleFrameId = '';
      state.isOpen = false;
    },
  },
});

export const {
  openVersionPanel: openVersionPanelAction,
  closeVersionPanel: closeVersionPanelAction,
} = slice.actions;

export const timetableVersionPanelReducer = slice.reducer;
