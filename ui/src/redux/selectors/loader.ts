import { createSelector } from '@reduxjs/toolkit';
import { Operation, importOperations, mapOperations } from '../slices/loader';
import { RootState } from '../store';

export const selectLoader = (state: RootState) => state.loader;

export const selectIsMapOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);

export const selectIsImportOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) =>
        importOperations.includes(operation as Operation),
      )
      .some(([, isLoading]) => isLoading),
);
