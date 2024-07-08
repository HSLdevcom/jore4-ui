import { createSelector } from '@reduxjs/toolkit';
import {
  LoadingState,
  Operation,
  getHighestLoadingState,
  joreOperations,
  mapOperations,
} from '../slices/loader';
import { RootState } from '../store';

export const selectLoader = (state: RootState) => state.loader;

export const selectIsMapOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .some(([, state]) => state !== LoadingState.NotLoading),
);

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
