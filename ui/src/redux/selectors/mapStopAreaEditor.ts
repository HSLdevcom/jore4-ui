import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapStopAreaEditor } from '../slices/mapStopAreaEditor';
import { RootState } from '../store';

export const selectMapStopAreaEditor = (state: RootState) =>
  mapFromStoreType<MapStopAreaEditor>(state.mapStopAreaEditor);

export const selectSelectedStopAreaId = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.selectedStopArea,
);

export const selectStopAreaEditorIsActive = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.selectedStopArea !== undefined,
);
