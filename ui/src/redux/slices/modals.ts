import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type IState = {
  readonly viaModal: ViaModalState;
  readonly timingPlaceModal: TimingPlaceModalState;
  readonly timingSettingsModal: TimingSettingsModalState;
  readonly changeTimetableValidityModal: ChangeTimetableValidityModalState;
  readonly deleteTimetableModal: deleteTimetableModalState;
  readonly cutStopVersionValidityModal: CutStopVersionValidityModalState;
};

type ViaModalState = {
  readonly isOpen: boolean;
  readonly journeyPatternId?: UUID;
  readonly stopLabel?: string;
};

type ChangeTimetableValidityModalState = {
  readonly isOpen: boolean;
  readonly vehicleScheduleFrameId?: UUID;
  readonly lastModifiedVehicleScheduleFrame?: {
    readonly vehicleScheduleFrameId: UUID;
    readonly validityStart: string;
    readonly validityEnd: string;
  };
};

type TimingSettingsModalState = {
  readonly isOpen: boolean;
  readonly data?: {
    readonly journeyPatternId: UUID;
    readonly stopLabel: string;
    readonly sequence: number;
  };
};

type TimingPlaceModalState = {
  readonly isOpen: boolean;
};

type deleteTimetableModalState = {
  readonly isOpen: boolean;
  readonly vehicleScheduleFrameId?: UUID;
};

type CutStopVersionValidityModalState = {
  readonly isOpen: boolean;
  readonly currentVersion?: string;
  readonly newVersion?: string;
  readonly cutDate?: string;
  readonly isCutToEnd?: boolean;
};

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
  cutStopVersionValidityModal: {
    isOpen: false,
    currentVersion: undefined,
    newVersion: undefined,
    cutDate: undefined,
    isCutToEnd: undefined,
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
    openCutStopVersionValidityModal: (
      state,
      action: PayloadAction<{
        currentVersion: string;
        newVersion: string;
        cutDate: string;
        isCutToEnd: boolean;
      }>,
    ) => {
      state.cutStopVersionValidityModal.isOpen = true;
      state.cutStopVersionValidityModal.currentVersion =
        action.payload.currentVersion;
      state.cutStopVersionValidityModal.newVersion = action.payload.newVersion;
      state.cutStopVersionValidityModal.cutDate = action.payload.cutDate;
      state.cutStopVersionValidityModal.isCutToEnd = action.payload.isCutToEnd;
    },
    closeCutStopVersionValidityModal: (state) => {
      state.cutStopVersionValidityModal.isOpen = false;
      state.cutStopVersionValidityModal.currentVersion = undefined;
      state.cutStopVersionValidityModal.newVersion = undefined;
      state.cutStopVersionValidityModal.cutDate = undefined;
      state.cutStopVersionValidityModal.isCutToEnd = undefined;
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
  openCutStopVersionValidityModal: openCutStopVersionValidityModalAction,
  closeCutStopVersionValidityModal: closeCutStopVersionValidityModalAction,
} = slice.actions;

export const modalsReducer = slice.reducer;
