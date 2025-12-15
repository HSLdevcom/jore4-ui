import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectMapModal = (state: RootState) => state.mapModal;

export const selectMapViewport = createSelector(
  selectMapModal,
  (mapModal) => mapModal.viewport,
);

export const selectMapStopSelection = createSelector(
  selectMapModal,
  (mapModal) => mapModal.stopSelection,
);
