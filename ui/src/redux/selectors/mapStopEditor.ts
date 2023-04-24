import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapStopEditorState } from '../slices/mapStopEditor';
import { RootState } from '../store';

export const selectMapStopEditor = (state: RootState) =>
  mapFromStoreType<MapStopEditorState>(state.mapStopEditor);

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
