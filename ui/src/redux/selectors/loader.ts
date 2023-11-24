import { createSelector } from '@reduxjs/toolkit';
import { Operation, joreOperations, mapOperations } from '../slices/loader';
import { RootState } from '../store';

export const selectLoader = (state: RootState) => state.loader;

export const selectIsMapOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);

export const selectIsJoreOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => joreOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);
