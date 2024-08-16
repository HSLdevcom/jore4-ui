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

export const selectDrawingMode = createSelector(
  selectMapRouteEditor,
  (mapRouteEditor) => mapRouteEditor.drawingMode,
);

export const selectEditedRouteIncludedStops = createSelector(
  selectMapRouteEditor,
  ({ editedRouteData }) =>
    editedRouteData.stopsEligibleForJourneyPattern.filter((stop) =>
      editedRouteData.includedStopLabels.includes(stop.label),
    ),
);
