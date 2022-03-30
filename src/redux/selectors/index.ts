import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectMap = (state: RootState) => state.map;
export const selectModalMap = (state: RootState) => state.modalMap;

export const selectSelectedStopId = createSelector(
  selectMap,
  (map) => map.selectedStopId,
);

export const selectIsModalMapOpen = createSelector(
  selectModalMap,
  (modalMap) => modalMap.isOpen,
);
