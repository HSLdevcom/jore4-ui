import produce from 'immer';
import { BusRouteResponse } from '../api/routing';
import { FormState as RouteFormState } from '../components/forms/CreateRouteForm';

export enum Mode {
  Draw,
  Edit,
}

export interface IMapEditorContext {
  hasRoute: boolean;
  canAddStops: boolean;
  routeDetails?: RouteFormState;
  drawingMode: Mode | undefined;
  busRoute?: BusRouteResponse;
  stopsWithinRoute?: ExplicitAny[]; // TODO: correct typings?
}

export const initialState: IMapEditorContext = {
  hasRoute: false,
  canAddStops: false,
  drawingMode: undefined,
  routeDetails: undefined,
  busRoute: undefined,
  stopsWithinRoute: undefined,
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
