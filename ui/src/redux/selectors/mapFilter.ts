import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export function selectMapFilter(state: RootState) {
  return state.mapFilter;
}

export const selectShowMapEntityTypes = createSelector(
  selectMapFilter,
  (mapFilter) => mapFilter.showMapEntityType,
);
