import { createSelector } from '@reduxjs/toolkit';
import { LoadingState } from '../../types';
import {
  Operation,
  getHighestLoadingState,
  joreOperations,
  mapOperations,
} from '../slices/loader';
import { RootState } from '../store';

export function selectLoader(state: RootState) {
  return state.loader;
}

export const selectMapOperationLoadingState = createSelector(
  selectLoader,
  (loaders) => {
    const mapStates = Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .map(([, state]) => state);
    return getHighestLoadingState(mapStates);
  },
);

export const selectIsJoreOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => joreOperations.includes(operation as Operation))
      .some(([, state]) => state !== LoadingState.NotLoading),
);
