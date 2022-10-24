import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  JourneyPatternStopFragment,
  LineAllFieldsFragment,
  RouteStopFieldsFragment,
} from '../../generated/graphql';
import { RouteInfraLink } from '../../graphql';
import { mapToStoreType, StoreType } from '../mappers/storeType';

export interface EditedRouteData {
  /**
   * Id of the edited route
   */
  id?: UUID;
  /**
   * Metadata of the line to which the route belongs
   * Used e.g. for determining the vehicle mode
   */
  lineInfo?: LineAllFieldsFragment;
  /**
   * Array of infrastructure links along the created / edited route
   */
  infraLinks?: RouteInfraLink[];
  /**
   * Id of the route used as a template route, when creating a new route
   */
  templateRouteId?: UUID;
  /**
   * Metadata of the created / edited route
   */
  // TODO: Use RouteMetadataFragment
  metaData?: RouteFormState;
  /**
   * Array of stop labels that are included in the edited route
   */
  includedStopLabels: string[];
  /**
   * Array of metadata about a stop in journey pattern (including but not limited to via info)
   */
  journeyPatternStops: JourneyPatternStopFragment[];
  /**
   * Array of stops that are eligible to be added to the journey pattern
   */
  stopsEligibleForJourneyPattern: RouteStopFieldsFragment[];
}

export interface MapRouteEditorState {
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
  editedRouteData: EditedRouteData;
  /**
   * Is route metadata form open
   */
  isRouteMetadataFormOpen: boolean;
  /**
   * Id of the route that has been selected in the map view
   */
  selectedRouteId?: UUID;
}

type IState = StoreType<MapRouteEditorState>;

const initialState: IState = {
  creatingNewRoute: false,
  drawingMode: undefined,
  editedRouteData: {
    id: undefined,
    lineInfo: undefined,
    metaData: undefined,
    includedStopLabels: [],
    journeyPatternStops: [],
    stopsEligibleForJourneyPattern: [],
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
const slice = createSlice({
  name: 'mapRouteEditor',
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
     * Adds given stop label to edited route journey pattern
     */
    includeStopToJourneyPattern: (
      state: IState,
      action: PayloadAction<string>,
    ) => {
      const { includedStopLabels } = state.editedRouteData;

      state.editedRouteData.includedStopLabels = uniq([
        ...includedStopLabels,
        action.payload,
      ]);
    },
    /**
     * Deletes given stop label from edited route journey pattern
     */
    excludeStopFromJourneyPattern: (
      state: IState,
      action: PayloadAction<string>,
    ) => {
      const { includedStopLabels } = state.editedRouteData;

      state.editedRouteData.includedStopLabels = includedStopLabels.filter(
        (label) => label !== action.payload,
      );
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
        state: IState,
        action: PayloadAction<StoreType<LineAllFieldsFragment>>,
      ) => {
        state.editedRouteData.lineInfo = action.payload;
      },
      prepare: (line: LineAllFieldsFragment) => {
        return { payload: mapToStoreType(line) };
      },
    },
    /**
     * Store created / edited route geometry in state.
     */
    setDraftRouteGeometry: {
      reducer: (
        state: IState,
        action: PayloadAction<
          StoreType<{
            includedStopLabels: string[];
            stopsEligibleForJourneyPattern: RouteStopFieldsFragment[];
            infraLinks: RouteInfraLink[];
          }>
        >,
      ) => {
        const {
          includedStopLabels,
          stopsEligibleForJourneyPattern,
          infraLinks,
        } = action.payload;

        state.editedRouteData = {
          ...state.editedRouteData,
          includedStopLabels: uniq(includedStopLabels),
          stopsEligibleForJourneyPattern,
          infraLinks,
        };
      },
      prepare: ({
        includedStopLabels,
        stopsEligibleForJourneyPattern,
        infraLinks,
      }: {
        includedStopLabels: string[];
        stopsEligibleForJourneyPattern: RouteStopFieldsFragment[];
        infraLinks: RouteInfraLink[];
      }) => ({
        payload: mapToStoreType({
          includedStopLabels,
          stopsEligibleForJourneyPattern,
          infraLinks,
        }),
      }),
    },
    /**
     * Set draft route journey pattern stops
     */
    setDraftRouteJourneyPatternStops: (
      state: IState,
      action: PayloadAction<JourneyPatternStopFragment[]>,
    ) => {
      state.editedRouteData.journeyPatternStops = action.payload;
    },
    /**
     * Reset created / edited route geometry in state.
     */
    resetDraftRouteGeometry: (state: IState) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        includedStopLabels: [],
        journeyPatternStops: [],
        stopsEligibleForJourneyPattern: [],
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
  },
});

export const {
  reset: resetMapRouteEditorStateAction,
  startRouteCreating: startRouteCreatingAction,
  resetRouteCreating: resetRouteCreatingAction,
  startRouteEditing: startRouteEditingAction,
  stopRouteEditing: stopRouteEditingAction,
  setTemplateRouteId: setTemplateRouteIdAction,
  includeStopToJourneyPattern: includeStopToJourneyPatternAction,
  excludeStopFromJourneyPattern: excludeStopFromJourneyPatternAction,
  setRouteMetadata: setRouteMetadataAction,
  finishRouteMetadataEditing: finishRouteMetadataEditingAction,
  setLineInfo: setLineInfoAction,
  setDraftRouteGeometry: setDraftRouteGeometryAction,
  resetDraftRouteGeometry: resetDraftRouteGeometryAction,
  setSelectedRouteId: setSelectedRouteIdAction,
  setRouteMetadataFormOpen: setRouteMetadataFormOpenAction,
  setDraftRouteJourneyPatternStops: setDraftRouteJourneyPatternStopsAction,
} = slice.actions;

export const mapRouteEditorReducer = slice.reducer;
