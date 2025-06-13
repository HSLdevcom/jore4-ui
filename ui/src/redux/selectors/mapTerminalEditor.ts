import { createSelector } from '@reduxjs/toolkit';
import { mapFromStoreType } from '../mappers';
import { MapTerminalEditorState } from '../slices/mapTerminalEditor';
import { RootState } from '../store';

export const selectMapTerminalEditor = createSelector(
  (state: RootState) => state.mapTerminalEditor,
  (mapTerminalEditor) =>
    mapFromStoreType<MapTerminalEditorState>(mapTerminalEditor),
);

export const selectSelectedTerminalId = createSelector(
  selectMapTerminalEditor,
  (mapTerminalEditor) => mapTerminalEditor.selectedTerminalId,
);

export const selectDraftTerminalLocation = createSelector(
  selectMapTerminalEditor,
  (mapTerminalEditor) => mapTerminalEditor.draftLocation,
);

export const selectHasDraftTerminalLocation = createSelector(
  selectMapTerminalEditor,
  (mapTerminalEditor) => !!mapTerminalEditor.draftLocation,
);

export const selectMapTerminalViewState = createSelector(
  selectMapTerminalEditor,
  (mapTerminalEditor) => mapTerminalEditor.viewState,
);
