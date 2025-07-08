import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectModals = (state: RootState) => state.modals;

export const selectViaModal = createSelector(
  selectModals,
  (modals) => modals.viaModal,
);

export const selectIsViaModalOpen = createSelector(
  selectModals,
  (modals) => modals.viaModal.isOpen,
);

export const selectIsTimingPlaceModalOpen = createSelector(
  selectModals,
  (modals) => modals.timingPlaceModal.isOpen,
);

export const selectTimingSettingsModal = createSelector(
  selectModals,
  (modals) => modals.timingSettingsModal,
);

export const selectIsTimingSettingsModalOpen = createSelector(
  selectTimingSettingsModal,
  (timingSettingsModal) => timingSettingsModal.isOpen,
);

export const selectChangeTimetableValidityModal = createSelector(
  selectModals,
  (modals) => modals.changeTimetableValidityModal,
);

export const selectDeleteTimetableModal = createSelector(
  selectModals,
  (modals) => modals.deleteTimetableModal,
);

export const selectCutStopVersionValidityModal = createSelector(
  selectModals,
  (modals) => modals.cutStopVersionValidityModal,
);

export const selectIsCutStopVersionValidityModalOpen = createSelector(
  selectCutStopVersionValidityModal,
  (cutStopVersionValidityModal) => cutStopVersionValidityModal.isOpen,
);
