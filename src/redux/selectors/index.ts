import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';

export const selectMap = (state: RootState) => state.map;
export const selectSelectedStopId = createSelector(
  selectMap,
  (map) => map.selectedStopId,
);
