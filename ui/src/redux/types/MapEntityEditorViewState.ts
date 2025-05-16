export enum MapEntityEditorViewState {
  NONE = 'NONE',
  PLACE = 'PLACE',
  CREATE = 'CREATE',
  POPUP = 'POPUP',
  EDIT = 'EDIT',
  MOVE = 'MOVE',
}

type NonEditingViewState =
  | MapEntityEditorViewState.NONE
  | MapEntityEditorViewState.POPUP;

type MoveOrPlaceViewState =
  | MapEntityEditorViewState.PLACE
  | MapEntityEditorViewState.MOVE;

type ModalOpenViewState =
  | MapEntityEditorViewState.CREATE
  | MapEntityEditorViewState.EDIT;

type EditingViewState = MoveOrPlaceViewState | ModalOpenViewState;
type StaticPositionViewState = NonEditingViewState | ModalOpenViewState;
type ModalClosedViewState = NonEditingViewState | MoveOrPlaceViewState;

export function isNoneOrPopup(viewState: NonEditingViewState): true;
export function isNoneOrPopup(viewState: EditingViewState): false;
export function isNoneOrPopup(viewState: MapEntityEditorViewState): boolean;
export function isNoneOrPopup(viewState: MapEntityEditorViewState): boolean {
  return (
    viewState === MapEntityEditorViewState.NONE ||
    viewState === MapEntityEditorViewState.POPUP
  );
}

export function isEditorOpen(viewState: NonEditingViewState): false;
export function isEditorOpen(viewState: EditingViewState): true;
export function isEditorOpen(viewState: MapEntityEditorViewState): boolean;
export function isEditorOpen(viewState: MapEntityEditorViewState): boolean {
  return !isNoneOrPopup(viewState);
}

export function isPlacingOrMoving(viewState: MoveOrPlaceViewState): true;
export function isPlacingOrMoving(viewState: StaticPositionViewState): false;
export function isPlacingOrMoving(viewState: MapEntityEditorViewState): boolean;
export function isPlacingOrMoving(
  viewState: MapEntityEditorViewState,
): boolean {
  return (
    viewState === MapEntityEditorViewState.PLACE ||
    viewState === MapEntityEditorViewState.MOVE
  );
}

export function isModalOpen(viewState: ModalOpenViewState): true;
export function isModalOpen(viewState: ModalClosedViewState): false;
export function isModalOpen(viewState: MapEntityEditorViewState): boolean;
export function isModalOpen(viewState: MapEntityEditorViewState): boolean {
  return (
    viewState === MapEntityEditorViewState.CREATE ||
    viewState === MapEntityEditorViewState.EDIT
  );
}
