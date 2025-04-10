import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapStopEditorState } from '../slices/mapStopEditor';
import { RootState } from '../store';

export const selectMapStopEditor = createSelector(
  (state: RootState) => state.mapStopEditor,
  (mapStopEditor) => mapFromStoreType<MapStopEditorState>(mapStopEditor),
);

export const selectSelectedStopId = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.selectedStopId,
);

export const selectDraftLocation = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.draftLocation,
);

export const selectIsCreateStopModeEnabled = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.isCreateStopModeEnabled,
);

export const selectIsMoveStopModeEnabled = createSelector(
  selectMapStopEditor,
  (mapStopEditor) => mapStopEditor.isMoveStopModeEnabled,
);
