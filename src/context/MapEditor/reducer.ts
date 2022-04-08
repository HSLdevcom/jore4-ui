import produce from 'immer';
import { RouteFormState } from '../../components/forms/RoutePropertiesForm.types';
import { InfrastructureLinkAlongRoute } from '../../graphql';

export enum Mode {
  Draw,
  Edit,
}

export interface RouteStop {
  id: UUID;
  belongsToRoute: boolean;
}

export interface IMapEditorContext {
  hasRoute: boolean;
  initiallyDisplayedRouteIds?: UUID[];
  displayedRouteIds?: UUID[];
  creatingNewRoute: boolean;
  drawingMode: Mode | undefined;
  editedRouteData: {
    id?: UUID;
    metaData?: Partial<RouteFormState>;
    stops: RouteStop[];
    infraLinks?: InfrastructureLinkAlongRoute[];
    templateRouteId?: UUID;
  };
}

export const initialState: IMapEditorContext = {
  hasRoute: false,
  initiallyDisplayedRouteIds: undefined,
  displayedRouteIds: undefined,
  creatingNewRoute: false,
  drawingMode: undefined,
  editedRouteData: {
    id: undefined,
    metaData: undefined,
    stops: [],
    infraLinks: [],
    templateRouteId: undefined,
  },
};

export type MapEditorActions =
  | 'reset'
  | 'setState'
  | 'startDrawRoute'
  | 'stopDrawRoute'
  | 'startEditRoute'
  | 'stopEditRoute';

const reducerFunction = (
  draft: IMapEditorContext,
  action: {
    type: MapEditorActions;
    payload?: Partial<IMapEditorContext>;
  },
) => {
  const { type, payload } = action;

  const routeToEdit = draft.creatingNewRoute
    ? undefined
    : draft?.displayedRouteIds?.[0];

  // note: with the use or 'immer', we can modify the state object directly
  switch (type) {
    case 'reset':
      return initialState;
    case 'setState':
      return { ...draft, ...payload };
    case 'startDrawRoute':
      draft.drawingMode = Mode.Draw;
      draft.creatingNewRoute = true;
      draft.editedRouteData = initialState.editedRouteData;
      break;
    case 'stopDrawRoute':
      draft.drawingMode = undefined;
      draft.creatingNewRoute = false;
      draft.editedRouteData = initialState.editedRouteData;
      break;
    case 'startEditRoute':
      draft.drawingMode = Mode.Edit;
      draft.editedRouteData = {
        ...draft.editedRouteData,
        id: routeToEdit,
      };
      break;
    case 'stopEditRoute':
      draft.drawingMode = undefined;
      break;
    default:
  }
  return draft;
};

export const mapEditorReducer = produce(reducerFunction);
