import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  viaModal: ViaModalState;
  timingPlaceModal: TimingPlaceModalState;
  timingSettingsModal: TimingSettingsModalState;
  changeTimetableValidityModal: ChangeTimetableValidityModalState;
}

interface ViaModalState {
  isOpen: boolean;
  journeyPatternId?: UUID;
  stopLabel?: string;
}

interface ChangeTimetableValidityModalState {
  isOpen: boolean;
  vehicleScheduleFrameId?: UUID;
  lastModifiedVehicleScheduleFrameId?: {
    vehicleScheduleFrameId: UUID;
    validityStart: string;
    validityEnd: string;
  };
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
  changeTimetableValidityModal: {
    isOpen: false,
    vehicleScheduleFrameId: undefined,
    lastModifiedVehicleScheduleFrameId: undefined,
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
    openChangeTimetableValidityModal: (state, action: PayloadAction<UUID>) => {
      state.changeTimetableValidityModal = {
        isOpen: true,
        vehicleScheduleFrameId: action.payload,
      };
    },
    closeChangeTimetableValidityModal: (state) => {
      state.changeTimetableValidityModal = {
        ...initialState.changeTimetableValidityModal,
        lastModifiedVehicleScheduleFrameId:
          state.changeTimetableValidityModal.lastModifiedVehicleScheduleFrameId,
      };
    },
    setChangeTimetableValidityModalSuccessResult: (
      state,
      action: PayloadAction<{
        vehicleScheduleFrameId: UUID;
        validityStart: string;
        validityEnd: string;
      }>,
    ) => {
      state.changeTimetableValidityModal = {
        ...state.changeTimetableValidityModal,
        lastModifiedVehicleScheduleFrameId: action.payload,
      };
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
  openChangeTimetableValidityModal: openChangeTimetableValidityModalAction,
  setChangeTimetableValidityModalSuccessResult:
    setChangeTimetableValidityModalSuccessResultAction,
  closeChangeTimetableValidityModal: closeChangeTimetableValidityModalAction,
} = slice.actions;

export const modalsReducer = slice.reducer;
