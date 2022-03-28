import { IMapEditorContext } from './reducer';

export const isInViewModeSelector = (state: IMapEditorContext) =>
  state.drawingMode === undefined;

export const hasChangesInProgressSelector = (state: IMapEditorContext) => {
  const isInViewMode = isInViewModeSelector(state);
  return state.creatingNewRoute || !isInViewMode;
};
