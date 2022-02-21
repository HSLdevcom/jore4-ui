import produce, { enableMapSet } from 'immer';
import { BusRouteResponse } from '../api/routing';
import { FormState as RouteFormState } from '../components/forms/RoutePropertiesForm';
import { InfrastructureLinkAlongRoute } from '../graphql';

enableMapSet();

export enum Mode {
  Draw,
  Edit,
}

export interface IMapEditorContext {
  hasRoute: boolean;
  displayedRouteIds?: UUID[];
  creatingNewRoute: boolean;
  editingRouteId?: UUID | null;
  selectedStopId?: UUID;
  canAddStops: boolean;
  routeDetails: Map<UUID | null, Partial<RouteFormState>>;
  drawingMode: Mode | undefined;
  busRoute?: BusRouteResponse;
  stopIdsWithinRoute?: string[];
  infraLinksAlongRoute: Map<UUID | null, InfrastructureLinkAlongRoute[]>;
}

export const initialState: IMapEditorContext = {
  hasRoute: false,
  displayedRouteIds: undefined,
  creatingNewRoute: false,
  selectedStopId: undefined,
  canAddStops: false,
  drawingMode: undefined,
  routeDetails: new Map(),
  busRoute: undefined,
  stopIdsWithinRoute: undefined,
  infraLinksAlongRoute: new Map(),
};

export type MapEditorActions =
  | 'reset'
  | 'setState'
  | 'toggleAddStop'
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
    ? null
    : draft?.displayedRouteIds?.[0];

  // note: with the use or 'immer', we can modify the state object directly
  switch (type) {
    case 'reset':
      return initialState;
    case 'setState':
      return { ...draft, ...payload };
    case 'toggleAddStop':
      draft.drawingMode = undefined;
      draft.canAddStops = !draft.canAddStops;
      break;
    case 'startDrawRoute':
      draft.drawingMode = Mode.Draw;
      draft.creatingNewRoute = true;
      draft.editingRouteId = null;
      draft.infraLinksAlongRoute.set(null, []);
      break;
    case 'stopDrawRoute':
      draft.drawingMode = undefined;
      draft.creatingNewRoute = false;
      draft.editingRouteId = undefined;
      break;
    case 'startEditRoute':
      draft.drawingMode = Mode.Edit;
      draft.editingRouteId = routeToEdit;
      break;
    case 'stopEditRoute':
      draft.drawingMode = undefined;
      if (!draft.creatingNewRoute) {
        draft.editingRouteId = undefined;
      }

      break;
    default:
  }
  return draft;
};

export const mapEditorReducer = produce(reducerFunction);
