import produce from 'immer';
import { BusRouteResponse } from '../api/routing';
import { FormState as RouteFormState } from '../components/forms/CreateRouteForm';
import { InfrastructureLinkAlongRoute } from '../graphql/infrastructureNetwork';

export enum Mode {
  Draw,
  Edit,
}

export interface IMapEditorContext {
  hasRoute: boolean;
  canAddStops: boolean;
  routeDetails?: Partial<RouteFormState>;
  drawingMode: Mode | undefined;
  busRoute?: BusRouteResponse;
  stopIdsWithinRoute?: string[];
  infraLinksAlongRoute?: InfrastructureLinkAlongRoute[];
}

export const initialState: IMapEditorContext = {
  hasRoute: false,
  canAddStops: false,
  drawingMode: undefined,
  routeDetails: undefined,
  busRoute: undefined,
  stopIdsWithinRoute: undefined,
  infraLinksAlongRoute: undefined,
};

export type MapEditorActions =
  | 'reset'
  | 'setState'
  | 'toggleAddStop'
  | 'toggleDrawRoute'
  | 'toggleEditRoute';

const reducerFunction = (
  draft: IMapEditorContext,
  action: {
    type: MapEditorActions;
    payload?: Partial<IMapEditorContext>;
  },
) => {
  const { type, payload } = action;

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
    case 'toggleDrawRoute':
      draft.drawingMode =
        draft.drawingMode !== Mode.Draw ? Mode.Draw : undefined;
      break;
    case 'toggleEditRoute':
      draft.drawingMode =
        draft.drawingMode !== Mode.Edit ? Mode.Edit : undefined;
      break;
    default:
  }
  return draft;
};

export const mapEditorReducer = produce(reducerFunction);
