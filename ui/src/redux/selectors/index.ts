import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers/storeType';
import { mapOperations, Operation } from '../slices/loader';
import { MapState } from '../slices/map';
import { MapEditorState } from '../slices/mapEditor';
import { RootState } from '../store';

export const selectMap = (state: RootState) =>
  mapFromStoreType<MapState>(state.map);
export const selectMapEditor = (state: RootState) =>
  mapFromStoreType<MapEditorState>(state.mapEditor);
export const selectMapFilter = (state: RootState) => state.mapFilter;
export const selectModalMap = (state: RootState) => state.modalMap;
export const selectUser = (state: RootState) => state.user;
export const selectModals = (state: RootState) => state.modals;
export const selectLoader = (state: RootState) => state.loader;

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

export const selectIsMoveStopModeEnabled = createSelector(
  selectMap,
  (map) => map.isMoveStopModeEnabled,
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

export const selectDrawingMode = createSelector(
  selectMapEditor,
  (mapEditor) => mapEditor.drawingMode,
);

export const selectViaModal = createSelector(
  selectModals,
  (modals) => modals.viaModal,
);

export const selectIsViaModalOpen = createSelector(
  selectModals,
  (modals) => modals.viaModal.isOpen,
);

export const selectIsMapOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);

export const selectEditedRouteIncludedStops = createSelector(
  selectMapEditor,
  ({ editedRouteData }) =>
    editedRouteData.stopsEligibleForJourneyPattern.filter((stop) =>
      editedRouteData.includedStopLabels.includes(stop.label),
    ),
);
