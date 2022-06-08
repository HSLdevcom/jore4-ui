import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  viaModal: ViaModalState;
}

interface ViaModalState {
  isOpen: boolean;
  scheduledStopPointId?: UUID;
  journeyPatternId?: UUID;
}

const initialState: IState = {
  viaModal: {
    isOpen: false,
    scheduledStopPointId: undefined,
    journeyPatternId: undefined,
  },
};

const slice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openViaModal: (
      state,
      action: PayloadAction<{
        scheduledStopPointId: UUID;
        journeyPatternId: UUID;
      }>,
    ) => {
      state.viaModal.scheduledStopPointId = action.payload.scheduledStopPointId;
      state.viaModal.journeyPatternId = action.payload.journeyPatternId;
      state.viaModal.isOpen = true;
    },
    closeViaModal: (state) => {
      state.viaModal = initialState.viaModal;
    },
  },
});

export const {
  openViaModal: openViaModalAction,
  closeViaModal: closeViaModalAction,
} = slice.actions;

export const modalsReducer = slice.reducer;
