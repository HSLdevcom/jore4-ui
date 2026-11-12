import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapRouteEditorState } from '../slices/mapRouteEditor';
import { RootState } from '../store';

export const selectMapRouteEditor = createSelector(
  (state: RootState) => state.mapRouteEditor,
  (mapRouteEditor) => mapFromStoreType<MapRouteEditorState>(mapRouteEditor),
);

export const selectIsInViewMode = createSelector(
  selectMapRouteEditor,
  (mapModal) => mapModal.drawingMode === undefined,
);

export const selectHasChangesInProgress = createSelector(
  selectMapRouteEditor,
  selectIsInViewMode,
  (mapModal, viewMode) => mapModal.creatingNewRoute || !viewMode,
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

export const selectVisibleRouteIds = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.visibleRouteIds,
);

export const selectVisibleRouteIdsInitialized = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.visibleRouteIdsInitialized,
);

/**
 * Routes whose stops are shown on the map: the ones toggled visible in the
 * line overlay, plus the route currently being drawn / edited so its stops
 * stay available for picking while its geometry is not yet toggled visible.
 * Merely opening a row's stop list does not add its route here; that would
 * let its stops bypass the same visibility toggle that hides its geometry.
 */
export const selectVisibleOrSelectedRouteIds = createSelector(
  selectVisibleRouteIds,
  selectSelectedRouteId,
  selectHasChangesInProgress,
  (
    visibleRouteIds,
    selectedRouteId,
    hasChangesInProgress,
  ): ReadonlyArray<UUID> =>
    hasChangesInProgress &&
    selectedRouteId &&
    !visibleRouteIds.includes(selectedRouteId)
      ? [...visibleRouteIds, selectedRouteId]
      : visibleRouteIds,
);

export const selectLastCreatedRouteLabel = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.lastCreatedRouteLabel,
);

export const selectDrawingMode = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.drawingMode,
);

export const selectIsRedrawingExistingRoute = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.geometryClearedForRedraw,
);

export const selectEditedRouteIncludedStops = createSelector(
  selectMapRouteEditor,
  ({ editedRouteData }) =>
    editedRouteData.stopsEligibleForJourneyPattern.filter((stop) =>
      editedRouteData.includedStopLabels.includes(stop.label),
    ),
);
