import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import omit from 'lodash/omit';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { LineAllFieldsFragment, RouteLine } from '../../generated/graphql';
import { RouteInfraLink, RouteStop } from '../../graphql';
import { mapToStoreType, StoreType } from '../utils/mappers';

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
    metaData?: RouteFormState;
    /**
     * Metadata of the line to which the route belongs
     * Used e.g. for determining the vehicle mode
     */
    lineInfo?: StoreType<LineAllFieldsFragment>;
    /**
     * Array of stops along the route geometry with
     * information whether or not the stops belongs to the route (journey pattern)
     */
    stops: RouteStop[];
    /**
     * Array of infrastructure links along the created / edited route
     */
    infraLinks?: RouteInfraLink[];
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
  /**
   * Is map editor loading
   */
  isLoading: boolean;
}

const initialState: IState = {
  initiallyDisplayedRouteIds: undefined,
  displayedRouteIds: undefined,
  creatingNewRoute: false,
  drawingMode: undefined,
  editedRouteData: {
    id: undefined,
    metaData: undefined,
    lineInfo: undefined,
    stops: [],
    infraLinks: [],
    templateRouteId: undefined,
  },
  isRouteMetadataFormOpen: false,
  selectedRouteId: undefined,
  isLoading: false,
};

export enum Mode {
  Draw,
  Edit,
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
    startRouteCreating: (state: IState) => {
      state.isRouteMetadataFormOpen = true;
      state.creatingNewRoute = true;
      state.selectedRouteId = undefined;
    },
    /**
     * Quit route creation mode. Reset draw mode and metadata.
     */
    resetRouteCreating: (state: IState) => {
      state.drawingMode = initialState.drawingMode;
      state.creatingNewRoute = false;
      state.editedRouteData = initialState.editedRouteData;
    },
    /**
     * Start editing route geometry. Could be existing route or freshly drawn draft route.
     */
    startRouteEditing: (state: IState) => {
      const routeToEdit = state.creatingNewRoute
        ? undefined
        : state.selectedRouteId;

      state.drawingMode = Mode.Edit;
      state.editedRouteData = {
        ...state.editedRouteData,
        id: routeToEdit,
      };
    },
    /**
     * Stop editing route geometry.
     */
    stopRouteEditing: (state: IState) => {
      state.drawingMode = undefined;
      if (!state.creatingNewRoute) {
        state.editedRouteData = initialState.editedRouteData;
      }
    },
    /**
     * Set template route to be used when drawing a new route.
     */
    setTemplateRouteId: (
      state: IState,
      action: PayloadAction<UUID | undefined>,
    ) => {
      state.editedRouteData.templateRouteId = action.payload;
    },
    /**
     * Set a stop to (not) belong to a route when creating / editing a route.
     */
    setStopOnRoute: (
      state: IState,
      action: PayloadAction<{
        stopLabel: string;
        belongsToJourneyPattern: boolean;
      }>,
    ) => {
      const { stopLabel, belongsToJourneyPattern } = action.payload;

      state.editedRouteData = {
        ...state.editedRouteData,
        stops: state.editedRouteData.stops?.map((item) =>
          item.label === stopLabel
            ? { ...item, belongsToJourneyPattern }
            : item,
        ),
      };
    },
    /**
     * Set created / edited route metadata.
     */
    setRouteMetadata: (
      state: IState,
      action: PayloadAction<RouteFormState>,
    ) => {
      state.editedRouteData.metaData = action.payload;
    },
    /**
     * Finish editing route metadata form, store metadata in state and close form.
     */
    finishRouteMetadataEditing: (
      state: IState,
      action: PayloadAction<RouteFormState>,
    ) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        metaData: action.payload,
      };

      // Start drawing mode only if a route has not been drawn already
      if (state.editedRouteData.infraLinks?.length === 0) {
        state.drawingMode = state.editedRouteData.templateRouteId
          ? Mode.Edit
          : Mode.Draw;
      }

      state.isRouteMetadataFormOpen = false;
    },
    /**
     * Set the line info to which the created / edited route belongs.
     */
    setLineInfo: {
      reducer: (
        state,
        action: PayloadAction<StoreType<LineAllFieldsFragment>>,
      ) => {
        state.editedRouteData.lineInfo = action.payload;
      },
      prepare: (line: RouteLine | LineAllFieldsFragment) => {
        // remove unused, nonserializable data from relations
        const plainLine = omit(line, ['line_routes']) as LineAllFieldsFragment;
        // serialize datetime fields
        const payload = mapToStoreType(plainLine, [
          'validity_start',
          'validity_end',
        ]);
        return { payload };
      },
    },

    /**
     * Initialize map editor state to show some routes.
     */
    initializeMapEditorWithRoutes: (
      state: IState,
      action: PayloadAction<UUID[]>,
    ) => {
      return {
        ...initialState,
        initiallyDisplayedRouteIds: action.payload,
      };
    },
    /**
     * Set route instances to show in the map view.
     */
    setDisplayedRouteIds: (state: IState, action: PayloadAction<UUID[]>) => {
      state.displayedRouteIds = action.payload;
    },
    /**
     * Store created / edited route geometry in state.
     */
    setDraftRouteGeometry: {
      reducer: (
        state: IState,
        action: PayloadAction<{
          stops: RouteStop[];
          infraLinks: RouteInfraLink[];
        }>,
      ) => {
        const { stops, infraLinks } = action.payload;

        state.editedRouteData = {
          ...state.editedRouteData,
          stops,
          infraLinks,
        };
      },
      prepare: ({
        stops,
        infraLinks,
      }: {
        stops: RouteStop[];
        infraLinks: RouteInfraLink[];
      }) => ({
        payload: {
          stops,
          // remove unnecessary, nonserializable stops from infra link data
          infraLinks: infraLinks.map((item) => ({
            ...item,
            scheduled_stop_points_located_on_infrastructure_link: [],
          })),
        },
      }),
    },

    /**
     * Reset created / edited route geometry in state.
     */
    resetDraftRouteGeometry: (state: IState) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        stops: [],
        infraLinks: [],
      };
    },
    /**
     * Select a route by id.
     */
    setSelectedRouteId: (
      state: IState,
      action: PayloadAction<UUID | undefined>,
    ) => {
      state.selectedRouteId = action.payload;
    },
    /**
     * Set route metadata edit form open / closed.
     */
    setRouteMetadataFormOpen: (
      state: IState,
      action: PayloadAction<boolean>,
    ) => {
      state.isRouteMetadataFormOpen = action.payload;
    },
    /**
     * Set map editor loading state
     */
    setLoading: (state: IState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
  setLineInfo: setLineInfoAction,
  initializeMapEditorWithRoutes: initializeMapEditorWithRoutesAction,
  setDisplayedRouteIds: setDisplayedRouteIdsAction,
  setDraftRouteGeometry: setDraftRouteGeometryAction,
  resetDraftRouteGeometry: resetDraftRouteGeometryAction,
  setSelectedRouteId: setSelectedRouteIdAction,
  setRouteMetadataFormOpen: setRouteMetadataFormOpenAction,
  setLoading: setMapEditorLoadingAction,
} = slice.actions;

export const mapEditorReducer = slice.reducer;
