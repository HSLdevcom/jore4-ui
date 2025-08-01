import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapStopAreaEditor } from '../slices/mapStopAreaEditor';
import { RootState } from '../store';

export const selectMapStopAreaEditor = createSelector(
  (state: RootState) => state.mapStopAreaEditor,
  (mapStopAreaEditor) => mapFromStoreType<MapStopAreaEditor>(mapStopAreaEditor),
);

export const selectSelectedStopAreaId = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.selectedStopAreaId,
);

export const selectDraftStopAreaLocation = createSelector(
  selectMapStopAreaEditor,
  (mapTerminalEditor) => mapTerminalEditor.draftLocation,
);

export const selectEditedStopAreaData = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreaEditor) => mapStopAreaEditor.editedStopAreaData,
);

export const selectMapStopAreaViewState = createSelector(
  selectMapStopAreaEditor,
  (mapStopAreEditor) => mapStopAreEditor.viewState,
);
