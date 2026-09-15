import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapDepotStopEditorState } from '../slices/mapDepotStopEditor';
import { RootState } from '../store';

export const selectMapDepotStopEditor = createSelector(
  (state: RootState) => state.mapDepotStopEditor,
  (mapDepotStopEditor) =>
    mapFromStoreType<MapDepotStopEditorState>(mapDepotStopEditor),
);

export const selectMapDepotStopViewState = createSelector(
  selectMapDepotStopEditor,
  (mapDepotStopEditor) => mapDepotStopEditor.viewState,
);

export const selectDepotStopDraftLocation = createSelector(
  selectMapDepotStopEditor,
  (mapDepotStopEditor) => mapDepotStopEditor.draftLocation,
);
