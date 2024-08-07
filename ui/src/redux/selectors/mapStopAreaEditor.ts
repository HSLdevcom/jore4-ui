import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapStopAreaEditor } from '../slices/mapStopAreaEditor';
import { RootState } from '../store';

export const selectMapStopAreaEditor = (state: RootState) =>
  mapFromStoreType<MapStopAreaEditor>(state.mapStopAreaEditor);

export const selectSelectedStopAreaId = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.selectedStopAreaId,
);

export const selectStopAreaEditorIsActive = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.selectedStopAreaId !== undefined,
);

export const selectEditedStopAreaData = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.editedStopAreaData,
);
