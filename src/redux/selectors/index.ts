import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectMap = (state: RootState) => state.map;
export const selectMapEditor = (state: RootState) => state.mapEditor;
export const selectModalMap = (state: RootState) => state.modalMap;
export const selectUser = (state: RootState) => state.user;

export const selectSelectedStopId = createSelector(
  selectMap,
  (map) => map.selectedStopId,
);

export const selectEditedStopData = createSelector(
  selectMap,
  (map) => map.editedStopData,
);

export const selectIsCreateStopModeEnabled = createSelector(
  selectMap,
  (map) => map.isCreateStopModeEnabled,
);

export const selectIsModalMapOpen = createSelector(
  selectModalMap,
  (modalMap) => modalMap.isOpen,
);

export const selectIsInViewMode = createSelector(
  selectMapEditor,
  (modalMap) => modalMap.drawingMode === undefined,
);

export const selectHasChangesInProgress = createSelector(
  selectMapEditor,
  selectIsInViewMode,
  (modalMap, viewMode) => modalMap.creatingNewRoute || !viewMode,
);

export const selectHasDraftRouteGeometry = createSelector(
  selectMapEditor,
  (mapEditor) => !!mapEditor.editedRouteData.infraLinks?.length,
);
