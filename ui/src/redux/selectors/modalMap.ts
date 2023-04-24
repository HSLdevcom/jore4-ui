import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectModalMap = (state: RootState) => state.modalMap;

export const selectMapViewport = createSelector(
  selectModalMap,
  (modalMap) => modalMap.viewport,
);
