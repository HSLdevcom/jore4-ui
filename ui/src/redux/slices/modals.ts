import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  viaModal: ViaModalState;
  timingPlaceModal: TimingPlaceModalState;
  timingSettingsModal: TimingSettingsModalState;
  changeTimetableValidityModal: ChangeTimetableValidityModalState;
  deleteTimetableModal: deleteTimetableModalState;
}

interface ViaModalState {
  isOpen: boolean;
  journeyPatternId?: UUID;
  stopLabel?: string;
}

interface ChangeTimetableValidityModalState {
  isOpen: boolean;
  vehicleScheduleFrameId?: UUID;
  lastModifiedVehicleScheduleFrame?: {
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

interface deleteTimetableModalState {
  isOpen: boolean;
  vehicleScheduleFrameId?: UUID;
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
    lastModifiedVehicleScheduleFrame: undefined,
  },
  deleteTimetableModal: {
    isOpen: false,
    vehicleScheduleFrameId: undefined,
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
        lastModifiedVehicleScheduleFrame:
          state.changeTimetableValidityModal.lastModifiedVehicleScheduleFrame,
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
        lastModifiedVehicleScheduleFrame: action.payload,
      };
    },
    openDeleteTimetableModal: (state, action: PayloadAction<UUID>) => {
      state.deleteTimetableModal = {
        isOpen: true,
        vehicleScheduleFrameId: action.payload,
      };
    },
    closeDeleteTimetableModal: (state) => {
      state.deleteTimetableModal = {
        isOpen: false,
        vehicleScheduleFrameId: undefined,
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
  closeDeleteTimetableModal: closeDeleteTimetableModalAction,
  openDeleteTimetableModal: openDeleteTimetableModalAction,
} = slice.actions;

export const modalsReducer = slice.reducer;
