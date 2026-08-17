import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export function selectMapModal(state: RootState) {
  return state.mapModal;
}

export const selectMapViewport = createSelector(
  selectMapModal,
  (mapModal) => mapModal.viewport,
);

export const selectMapStopSelection = createSelector(
  selectMapModal,
  (mapModal) => mapModal.stopSelection,
);
