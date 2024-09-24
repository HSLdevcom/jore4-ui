import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectMapFilter = (state: RootState) => state.mapFilter;

export const selectShowMapEntityTypes = createSelector(
  selectMapFilter,
  (mapFilter) => mapFilter.showMapEntityType,
);
