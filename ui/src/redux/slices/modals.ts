import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  viaModal: ViaModalState;
}

interface ViaModalState {
  isOpen: boolean;
  journeyPatternId?: UUID;
  stopLabel?: string;
}

const initialState: IState = {
  viaModal: {
    isOpen: false,
    journeyPatternId: undefined,
    stopLabel: undefined,
  },
};

const slice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openViaModal: (
      state,
      action: PayloadAction<{
        journeyPatternId: UUID;
        stopLabel: string;
      }>,
    ) => {
      state.viaModal.stopLabel = action.payload.stopLabel;
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
