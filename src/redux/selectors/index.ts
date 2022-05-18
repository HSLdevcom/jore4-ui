import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { mapStoreStopToStop } from '../../graphql';
import { RootState } from '../store';

export const selectMap = (state: RootState) => state.map;
export const selectMapEditor = (state: RootState) => state.mapEditor;
export const selectMapFilter = (state: RootState) => state.mapFilter;
export const selectModalMap = (state: RootState) => state.modalMap;
export const selectUser = (state: RootState) => state.user;

export const selectSelectedStopId = createSelector(
  selectMap,
  (map) => map.selectedStopId,
);

export const selectEditedStopData = createSelector(selectMap, (map) =>
  map.editedStopData ? mapStoreStopToStop(map.editedStopData) : undefined,
);

export const selectIsCreateStopModeEnabled = createSelector(
  selectMap,
  (map) => map.isCreateStopModeEnabled,
);

export const selectIsModalMapOpen = createSelector(
  selectModalMap,
  (modalMap) => modalMap.isOpen,
);

export const selectMapViewport = createSelector(
  selectModalMap,
  (modalMap) => modalMap.viewport,
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

export const selectSelectedRouteId = createSelector(
  selectMapEditor,
  (mapEditor) => mapEditor.selectedRouteId,
);

export const selectMapObservationDate = createSelector(
  selectMapFilter,
  (mapFilter) => DateTime.fromISO(mapFilter.observationDate),
);
