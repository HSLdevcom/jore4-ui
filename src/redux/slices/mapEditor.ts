import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { InfrastructureLinkAlongRoute } from '../../graphql';

interface IState {
  /**
   * Array of route ids that have been selected to be shown on the map.
   * Because observation date can be selected, not all routes to be displayed
   * will be valid for given observation date. Therefore, displayedRouteIds
   * contains an array of route ids that are valid for the selected observation date.
   */
  initiallyDisplayedRouteIds?: UUID[];
  /**
   * Array of route ids to be displayed in the map.
   * Calculated dynamically based on initiallyDisplayedRouteIds and selected observation date.
   * Contains an array of route instances' ids based on initiallyDisplayedRouteIds,
   * that are valid for selected observation date.
   */
  displayedRouteIds?: UUID[];
  /**
   * Is new route creation in progress
   */
  creatingNewRoute: boolean;
  /**
   * Map editor's draw mode
   */
  drawingMode: Mode | undefined;
  /**
   * Data of route being created / edited
   */
  editedRouteData: {
    /**
     * Id of the edited route
     */
    id?: UUID;
    /**
     * Metadata of the created / edited route
     */
    metaData?: Partial<RouteFormState>;
    /**
     * Array of stops along the route geometry with
     * information whether or not the stops belongs to the route (journey pattern)
     */
    stops: RouteStop[];
    /**
     * Array of infrastructure links along the created / edited route
     */
    infraLinks?: InfrastructureLinkAlongRoute[];
    /**
     * Id of the route used as a template route, when creating a new route
     */
    templateRouteId?: UUID;
  };
  /**
   * Is route metadata form open
   */
  isRouteMetadataFormOpen: boolean;
  /**
   * Id of the route that has been selected in the map view
   */
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
  isRouteMetadataFormOpen: false,
  selectedRouteId: undefined,
};

export enum Mode {
  Draw,
  Edit,
}
export interface RouteStop {
  label: string;
  belongsToRoute: boolean;
}

const slice = createSlice({
  name: 'mapEditor',
  initialState,
  reducers: {
    reset: () => {
      return initialState;
    },
    /**
     * Start creating a new route. Start by opening metadata form.
     */
    startRouteCreating: (state) => {
      state.isRouteMetadataFormOpen = true;
      state.creatingNewRoute = true;
      state.selectedRouteId = undefined;
    },
    /**
     * Quit route creation mode. Reset draw mode and metadata.
     */
    resetRouteCreating: (state) => {
      state.drawingMode = initialState.drawingMode;
      state.creatingNewRoute = false;
      state.editedRouteData = initialState.editedRouteData;
    },
    /**
     * Start editing route geometry. Could be existing route or freshly drawn draft route.
     */
    startRouteEditing: (state) => {
      const routeToEdit = state.creatingNewRoute
        ? undefined
        : state?.selectedRouteId;

      state.drawingMode = Mode.Edit;
      state.editedRouteData = {
        ...state.editedRouteData,
        id: routeToEdit,
      };
    },
    /**
     * Stop editing route geometry.
     */
    stopRouteEditing: (state) => {
      state.drawingMode = undefined;
      if (!state.creatingNewRoute) {
        state.editedRouteData = initialState.editedRouteData;
      }
    },
    /**
     * Set template route to be used when drawing a new route.
     */
    setTemplateRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.editedRouteData.templateRouteId = action.payload;
    },
    /**
     * Set a stop to (not) belong to a route when creating / editing a route.
     */
    setStopOnRoute: (
      state,
      action: PayloadAction<{ stopLabel: string; belongsToRoute: boolean }>,
    ) => {
      const { stopLabel, belongsToRoute } = action.payload;

      state.editedRouteData = {
        ...state.editedRouteData,
        stops: state.editedRouteData.stops?.map((item) =>
          item.label === stopLabel ? { ...item, belongsToRoute } : item,
        ),
      };
    },
    /**
     * Set created / edited route metadata.
     */
    setRouteMetadata: (
      state,
      action: PayloadAction<Partial<RouteFormState>>,
    ) => {
      state.editedRouteData.metaData = action.payload;
    },
    /**
     * Finish editing route metadata form, store metadata in state and close form.
     */
    finishRouteMetadataEditing: (
      state,
      action: PayloadAction<Partial<RouteFormState>>,
    ) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        metaData: action.payload,
      };

      state.drawingMode = state.editedRouteData.templateRouteId
        ? Mode.Edit
        : Mode.Draw;
      state.isRouteMetadataFormOpen = false;
    },
    /**
     * Initialize map editor state to show some routes.
     */
    initializeMapEditorWithRoutes: (state, action: PayloadAction<UUID[]>) => {
      return {
        ...initialState,
        initiallyDisplayedRouteIds: action.payload,
      };
    },
    /**
     * Set route instances to show in the map view.
     */
    setDisplayedRouteIds: (state, action: PayloadAction<UUID[]>) => {
      state.displayedRouteIds = action.payload;
    },
    /**
     * Store created / edited route geometry in state.
     */
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
    /**
     * Reset created / edited route geometry in state.
     */
    resetDraftRouteGeometry: (state) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        stops: [],
        infraLinks: [],
      };
    },
    /**
     * Select a route by id.
     */
    setSelectedRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedRouteId = action.payload;
    },
    /**
     * Set route metadata edit form open / closed.
     */
    setRouteMetadataFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isRouteMetadataFormOpen = action.payload;
    },
  },
});

export const {
  reset: resetMapEditorStateAction,
  startRouteCreating: startRouteCreatingAction,
  resetRouteCreating: resetRouteCreatingAction,
  startRouteEditing: startRouteEditingAction,
  stopRouteEditing: stopRouteEditingAction,
  setTemplateRouteId: setTemplateRouteIdAction,
  setStopOnRoute: setStopOnRouteAction,
  setRouteMetadata: setRouteMetadataAction,
  finishRouteMetadataEditing: finishRouteMetadataEditingAction,
  initializeMapEditorWithRoutes: initializeMapEditorWithRoutesAction,
  setDisplayedRouteIds: setDisplayedRouteIdsAction,
  setDraftRouteGeometry: setDraftRouteGeometryAction,
  resetDraftRouteGeometry: resetDraftRouteGeometryAction,
  setSelectedRouteId: setSelectedRouteIdAction,
  setRouteMetadataFormOpen: setRouteMetadataFormOpenAction,
} = slice.actions;

export const mapEditorReducer = slice.reducer;
