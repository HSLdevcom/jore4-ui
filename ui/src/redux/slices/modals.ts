import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  viaModal: ViaModalState;
  timingPlaceModal: TimingPlaceModalState;
  timingSettingsModal: TimingSettingsModalState;
}

interface ViaModalState {
  isOpen: boolean;
  journeyPatternId?: UUID;
  stopLabel?: string;
}

interface TimingSettingsModalState {
  isOpen: boolean;
  data?: {
    journeyPatternId: UUID;
    stopLabel: string;
    sequence: number;
  };
}

interface TimingPlaceModalState {
  isOpen: boolean;
}

const initialState: IState = {
  viaModal: {
    isOpen: false,
    journeyPatternId: undefined,
    stopLabel: undefined,
  },
  timingPlaceModal: {
    isOpen: false,
  },
  timingSettingsModal: {
    isOpen: false,
    data: undefined,
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
    openTimingPlaceModal: (state) => {
      state.timingPlaceModal.isOpen = true;
    },
    closeTimingPlaceModal: (state) => {
      state.timingPlaceModal = initialState.timingPlaceModal;
    },
    openTimingSettingsModal: (
      state,
      action: PayloadAction<{
        journeyPatternId: UUID;
        stopLabel: string;
        sequence: number;
      }>,
    ) => {
      state.timingSettingsModal = {
        data: action.payload,
        isOpen: true,
      };
    },
    closeTimingSettingsModal: (state) => {
      state.timingSettingsModal = initialState.timingSettingsModal;
    },
  },
});

export const {
  openViaModal: openViaModalAction,
  closeViaModal: closeViaModalAction,
  openTimingPlaceModal: openTimingPlaceModalAction,
  closeTimingPlaceModal: closeTimingPlaceModalAction,
  openTimingSettingsModal: openTimingSettingsModalAction,
  closeTimingSettingsModal: closeTimingSettingsModalAction,
} = slice.actions;

export const modalsReducer = slice.reducer;
