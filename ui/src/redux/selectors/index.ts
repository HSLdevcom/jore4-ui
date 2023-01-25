import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers/storeType';
import { Operation, mapOperations } from '../slices/loader';
import { MapRouteEditorState } from '../slices/mapRouteEditor';
import { MapStopEditorState } from '../slices/mapStopEditor';
import { RootState } from '../store';

export const selectMapStopEditor = (state: RootState) =>
  mapFromStoreType<MapStopEditorState>(state.mapStopEditor);
export const selectMapRouteEditor = (state: RootState) =>
  mapFromStoreType<MapRouteEditorState>(state.mapRouteEditor);
export const selectMapFilter = (state: RootState) => state.mapFilter;
export const selectModalMap = (state: RootState) => state.modalMap;
export const selectUser = (state: RootState) => state.user;
export const selectModals = (state: RootState) => state.modals;
export const selectLoader = (state: RootState) => state.loader;
export const selectExport = (state: RootState) => state.export;

export const selectSelectedStopId = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.selectedStopId,
);

export const selectEditedStopData = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.editedStopData,
);

export const selectIsCreateStopModeEnabled = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.isCreateStopModeEnabled,
);

export const selectIsMoveStopModeEnabled = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.isMoveStopModeEnabled,
);

export const selectMapViewport = createSelector(
  selectModalMap,
  (modalMap) => modalMap.viewport,
);

export const selectIsInViewMode = createSelector(
  selectMapRouteEditor,
  (modalMap) => modalMap.drawingMode === undefined,
);

export const selectHasChangesInProgress = createSelector(
  selectMapRouteEditor,
  selectIsInViewMode,
  (modalMap, viewMode) => modalMap.creatingNewRoute || !viewMode,
);

export const selectEditedRouteData = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.editedRouteData,
);

export const selectHasDraftRouteGeometry = createSelector(
  selectEditedRouteData,
  (editedRouteData) => !!editedRouteData.geometry,
);

export const selectSelectedRouteId = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.selectedRouteId,
);

export const selectDrawingMode = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.drawingMode,
);

export const selectViaModal = createSelector(
  selectModals,
  (modals) => modals.viaModal,
);

export const selectIsViaModalOpen = createSelector(
  selectModals,
  (modals) => modals.viaModal.isOpen,
);

export const selectIsTimingPlaceModalOpen = createSelector(
  selectModals,
  (modals) => modals.timingPlaceModal.isOpen,
);

export const selectTimingSettingsModal = createSelector(
  selectModals,
  (modals) => modals.timingSettingsModal,
);

export const selectIsTimingSettingsModalOpen = createSelector(
  selectTimingSettingsModal,
  (timingSettingsModal) => timingSettingsModal.isOpen,
);

export const selectIsMapOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => mapOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);

export const selectIsOperationLoading = createSelector(
  selectLoader,
  (loaders) =>
    Object.entries(loaders)
      .filter(([operation]) => !mapOperations.includes(operation as Operation))
      .some(([, isLoading]) => isLoading),
);

export const selectEditedRouteIncludedStops = createSelector(
  selectMapRouteEditor,
  ({ editedRouteData }) =>
    editedRouteData.stopsEligibleForJourneyPattern.filter((stop) =>
      editedRouteData.includedStopLabels.includes(stop.label),
    ),
);
