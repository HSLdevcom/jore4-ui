import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteFormState } from '../../components/forms/RoutePropertiesForm.types';
import { InfrastructureLinkAlongRoute } from '../../graphql';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../store';

interface IState {
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
  selectedRouteId?: UUID;
}

const initialState: IState = {
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
  selectedRouteId: undefined,
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
    startDrawRoute: (state) => {
      state.drawingMode = Mode.Draw;
      state.creatingNewRoute = true;
    },
    stopDrawRoute: (state) => {
      state.drawingMode = initialState.drawingMode;
      state.creatingNewRoute = false;
      state.editedRouteData = initialState.editedRouteData;
    },
    startEditRoute: (state) => {
      const routeToEdit = state.creatingNewRoute
        ? undefined
        : state?.selectedRouteId;

      state.drawingMode = Mode.Edit;
      state.editedRouteData = {
        ...state.editedRouteData,
        id: routeToEdit,
      };
    },
    stopEditRoute: (state) => {
      state.drawingMode = undefined;
      if (!state.creatingNewRoute) {
        state.editedRouteData = initialState.editedRouteData;
      }
    },
    setTemplateRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.editedRouteData.templateRouteId = action.payload;
    },
    setStopOnRoute: (
      state,
      action: PayloadAction<{ stopId: UUID; belongsToRoute: boolean }>,
    ) => {
      const { stopId, belongsToRoute } = action.payload;

      state.editedRouteData = {
        ...state.editedRouteData,
        stops: state.editedRouteData.stops?.map((item) =>
          item.id === stopId ? { ...item, belongsToRoute } : item,
        ),
      };
    },
    populateNewRouteForm: (
      state,
      action: PayloadAction<Partial<RouteFormState>>,
    ) => {
      state.editedRouteData.metaData = action.payload;
    },
    saveNewRouteForm: (
      state,
      action: PayloadAction<Partial<RouteFormState>>,
    ) => {
      state.editedRouteData = {
        metaData: action.payload,
        stops: [],
        templateRouteId: state.editedRouteData.templateRouteId,
      };

      state.drawingMode = state.editedRouteData.templateRouteId
        ? Mode.Edit
        : Mode.Draw;
      state.selectedRouteId = undefined;
    },
    setInitiallyDisplayedRouteIds: (state, action: PayloadAction<UUID[]>) => {
      return {
        ...initialState,
        initiallyDisplayedRouteIds: action.payload,
      };
    },
    setDisplayedRouteIds: (state, action: PayloadAction<UUID[]>) => {
      state.displayedRouteIds = action.payload;
    },
    setDraftRouteGeometry: (
      state,
      action: PayloadAction<{
        stops: RouteStop[];
        infraLinks: InfrastructureLinkAlongRoute[];
      }>,
    ) => {
      const { stops, infraLinks } = action.payload;

      state.editedRouteData = {
        ...state.editedRouteData,
        stops,
        infraLinks,
      };
    },
    resetDraftRouteGeometry: (state) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        stops: [],
        infraLinks: [],
      };
    },
    setSelectedRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedRouteId = action.payload;
    },
  },
});

export const toggleDrawRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleDrawRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Draw) {
    thunkAPI.dispatch(slice.actions.stopDrawRoute());
  } else {
    thunkAPI.dispatch(slice.actions.startDrawRoute());
  }
});

export const toggleEditRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleEditRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Edit) {
    thunkAPI.dispatch(slice.actions.stopEditRoute());
  } else {
    thunkAPI.dispatch(slice.actions.startEditRoute());
  }
});

export const {
  reset: resetMapEditorStateAction,
  stopDrawRoute: stopDrawRouteAction,
  stopEditRoute: stopEditRouteAction,
  setTemplateRouteId: setTemplateRouteIdAction,
  setStopOnRoute: setStopOnRouteAction,
  populateNewRouteForm: populateNewRouteFormAction,
  saveNewRouteForm: saveNewRouteFormAction,
  setInitiallyDisplayedRouteIds: setInitiallyDisplayedRouteIdsAction,
  setDisplayedRouteIds: setDisplayedRouteIdsAction,
  setDraftRouteGeometry: setDraftRouteGeometryAction,
  resetDraftRouteGeometry: resetDraftRouteGeometryAction,
  setSelectedRouteId: setSelectedRouteIdAction,
} = slice.actions;

export const mapEditorReducer = slice.reducer;
