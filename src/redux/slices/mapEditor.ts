import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { InfrastructureLinkAlongRoute } from '../../graphql';

interface IState {
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

const initialState: IState = {
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

export enum Mode {
  Draw,
  Edit,
}
export interface RouteStop {
  id: UUID;
  belongsToRoute: boolean;
}

const slice = createSlice({
  name: 'mapEditor',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    setState: (state, action: PayloadAction<Partial<IState>>) => {
      return { ...state, ...action.payload };
    },
    startDrawRoute: (state) => {
      state.drawingMode = Mode.Draw;
      state.creatingNewRoute = true;
      state.editedRouteData = initialState.editedRouteData;
    },
    stopDrawRoute: (state) => {
      state.drawingMode = undefined;
      state.creatingNewRoute = false;
      state.editedRouteData = initialState.editedRouteData;
    },
    startEditRoute: (state) => {
      const routeToEdit = state.creatingNewRoute
        ? undefined
        : state?.displayedRouteIds?.[0];

      state.drawingMode = Mode.Edit;
      state.editedRouteData = {
        ...state.editedRouteData,
        id: routeToEdit,
      };
    },
    stopEditRoute: (state) => {
      state.drawingMode = undefined;
    },
  },
});

export const {
  reset: resetAction,
  setState: setStateAction,
  startDrawRoute: startDrawRouteAction,
  stopDrawRoute: stopDrawRouteAction,
  startEditRoute: startEditRouteAction,
  stopEditRoute: stopEditRouteAction,
} = slice.actions;

export const mapEditorReducer = slice.reducer;
