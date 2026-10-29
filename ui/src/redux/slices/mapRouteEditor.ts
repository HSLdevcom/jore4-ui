import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import uniq from 'lodash/uniq';
import {
  InfrastructureLinkAllFieldsFragment,
  LineAllFieldsFragment,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteStopFieldsFragment,
} from '../../generated/graphql';
import { RouteInfraLink } from '../../types';
import { Priority } from '../../types/enums';
import { StoreType, mapToStoreType } from '../mappers/storeType';
import { JourneyPattern } from '../types';

type TravelTargetNames = {
  readonly name: Required<LocalizedString>;
  readonly shortName: Required<LocalizedString>;
};

// Keep in sync with: routeFormSchema in ui/src/components/forms/route/RoutePropertiesForm.types.ts
export type EditedRouteMetadata = {
  readonly label: string;
  readonly priority: Priority;
  readonly direction: RouteDirectionEnum;
  readonly finnishName: string;
  readonly onLineId: string;
  readonly origin: TravelTargetNames;
  readonly destination: TravelTargetNames;
  readonly variant: number | null;
  readonly versionComment?: string | undefined;
  readonly validityStart: string;
  readonly indefinite: boolean;
  readonly validityEnd?: string | undefined;
};

export type EditedRouteData = {
  /**
   * Id of the edited route
   */
  readonly id?: UUID;
  /**
   * Metadata of the line to which the route belongs
   * Used e.g. for determining the vehicle mode
   */
  readonly lineInfo?: LineAllFieldsFragment;
  /**
   * Vehicle mode selected by the user when creating a new route.
   */
  readonly vehicleMode?: ReusableComponentsVehicleModeEnum;
  /**
   * Array of infrastructure links along the created / edited route
   */
  readonly infraLinks?: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >;
  /**
   * Id of the route used as a template route, when creating a new route
   */
  readonly templateRouteId?: UUID;
  /**
   * Metadata of the created / edited route
   */
  readonly metaData?: EditedRouteMetadata;
  /**
   * Route journey pattern
   */
  readonly journeyPattern: JourneyPattern;
  /**
   * Array of stop labels that are included in the edited route
   */
  readonly includedStopLabels: ReadonlyArray<string>;
  /**
   * Array of stops that are eligible to be added to the journey pattern
   */
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  /**
   * Draft route geometry
   */
  readonly geometry?: GeoJSON.LineString;
};

export type MapRouteEditorState = {
  /**
   * Is new route creation in progress
   */
  readonly creatingNewRoute: boolean;
  /**
   * Map editor's draw mode
   */
  readonly drawingMode: Mode | undefined;
  /**
   * Data of route being created / edited
   */
  readonly editedRouteData: EditedRouteData;
  /**
   * Is route metadata form open
   */
  readonly isRouteMetadataFormOpen: boolean;
  /**
   * Id of the route that has been selected in the map view
   */
  readonly selectedRouteId?: UUID;
  /**
   * Label of the most recently created route. Consumed once by the line view
   * on return from the map to add the route to the displayed-routes selection.
   */
  readonly lastCreatedRouteLabel?: string;
  /**
   * Prevent automatic geometry/snapping rehydration from backend route data
   * while staying in edit mode after explicitly clearing route geometry.
   */
  readonly suppressBaseRouteRehydrate: boolean;
  /**
   * Monotonic counter incremented when route geometry is explicitly deleted.
   * Used as a repeatable signal for draw-layer cleanup effects.
   */
  readonly routeGeometryDeleteVersion: number;
};

type IState = StoreType<MapRouteEditorState>;

const initialState: IState = {
  creatingNewRoute: false,
  drawingMode: undefined,
  editedRouteData: {
    id: undefined,
    lineInfo: undefined,
    vehicleMode: undefined,
    metaData: undefined,
    includedStopLabels: [],
    journeyPattern: {
      id: undefined,
      stops: [],
    },
    stopsEligibleForJourneyPattern: [],
    infraLinks: [],
    templateRouteId: undefined,
    geometry: undefined,
  },
  isRouteMetadataFormOpen: false,
  selectedRouteId: undefined,
  lastCreatedRouteLabel: undefined,
  suppressBaseRouteRehydrate: false,
  routeGeometryDeleteVersion: 0,
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
    startRouteCreating: (
      state,
      action: PayloadAction<ReusableComponentsVehicleModeEnum | undefined>,
    ) => {
      state.isRouteMetadataFormOpen = true;
      state.creatingNewRoute = true;
      state.selectedRouteId = undefined;
      state.editedRouteData.vehicleMode = action.payload;
      state.suppressBaseRouteRehydrate = false;
    },
    /**
     * Quit route creation mode. Reset draw mode and metadata.
     */
    resetRouteCreating: (state) => ({
      ...state,
      drawingMode: initialState.drawingMode,
      creatingNewRoute: false,
      editedRouteData: initialState.editedRouteData,
      suppressBaseRouteRehydrate: false,
    }),
    /**
     * Start editing route geometry. Could be existing route or freshly drawn draft route.
     */
    startRouteEditing: (state) => {
      const routeToEdit = state.creatingNewRoute
        ? undefined
        : state.selectedRouteId;

      state.editedRouteData = {
        ...state.editedRouteData,
        id: routeToEdit,
      };
      state.suppressBaseRouteRehydrate = false;
    },
    setRouteToEditMode: (state) => {
      return {
        ...state,
        drawingMode: Mode.Edit,
      };
    },
    setRouteToDrawMode: (state) => {
      return {
        ...state,
        drawingMode: Mode.Draw,
      };
    },
    /**
     * Start redraw flow for an existing route after geometry has been cleared.
     * Uses draw-mode creation UX while preserving edited route identity for save/edit.
     */
    startExistingRouteRedraw: (state) => {
      state.creatingNewRoute = true;
      state.drawingMode = Mode.Draw;
      state.isRouteMetadataFormOpen = false;
      state.suppressBaseRouteRehydrate = true;
    },
    /**
     * Stop redraw draw-mode for an existing route and return to edit mode
     * without restoring original backend geometry yet.
     */
    stopExistingRouteRedraw: (state) => {
      state.creatingNewRoute = false;
      state.drawingMode = Mode.Edit;
      state.isRouteMetadataFormOpen = false;
      state.suppressBaseRouteRehydrate = true;
    },
    /**
     * Stop editing route geometry.
     */
    stopRouteEditing: (state) =>
      !state.creatingNewRoute
        ? {
            ...state,
            drawingMode: undefined,
            editedRouteData: initialState.editedRouteData,
            suppressBaseRouteRehydrate: false,
          }
        : {
            ...state,
            drawingMode: undefined,
            suppressBaseRouteRehydrate: false,
          },
    /**
     * Set template route to be used when drawing a new route.
     */
    setTemplateRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.editedRouteData.templateRouteId = action.payload;
    },
    /**
     * Adds given stop label to edited route journey pattern
     */
    includeStopToJourneyPattern: (state, action: PayloadAction<string>) => {
      const { includedStopLabels } = state.editedRouteData;

      state.editedRouteData.includedStopLabels = uniq([
        ...includedStopLabels,
        action.payload,
      ]);
    },
    /**
     * Deletes given stop label from edited route journey pattern
     */
    excludeStopFromJourneyPattern: (state, action: PayloadAction<string>) => {
      const { includedStopLabels } = state.editedRouteData;

      state.editedRouteData.includedStopLabels = includedStopLabels.filter(
        (label) => label !== action.payload,
      );
    },
    /**
     * Set created / edited route metadata.
     */
    setRouteMetadata: (state, action: PayloadAction<EditedRouteMetadata>) => {
      state.editedRouteData.metaData = action.payload;
    },
    /**
     * Finish editing route metadata form, store metadata in state and close form.
     */
    finishRouteMetadataEditing: (
      state,
      action: PayloadAction<EditedRouteMetadata>,
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
      prepare: (line: LineAllFieldsFragment) => {
        return { payload: mapToStoreType(line) };
      },
    },
    /**
     * Store created / edited route geometry in state.
     */
    setDraftRouteGeometry: {
      reducer: (
        state,
        action: PayloadAction<
          StoreType<{
            includedStopLabels: ReadonlyArray<string>;
            stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
            infraLinks: ReadonlyArray<
              RouteInfraLink<InfrastructureLinkAllFieldsFragment>
            >;
            geometry?: GeoJSON.LineString;
          }>
        >,
      ) => {
        const {
          includedStopLabels,
          stopsEligibleForJourneyPattern,
          infraLinks,
          geometry,
        } = action.payload;

        return {
          ...state,
          editedRouteData: {
            ...state.editedRouteData,
            includedStopLabels: uniq(includedStopLabels),
            stopsEligibleForJourneyPattern,
            infraLinks,
            geometry,
          },
        };
      },
      prepare: ({
        includedStopLabels,
        stopsEligibleForJourneyPattern,
        infraLinks,
        geometry,
      }: {
        includedStopLabels: ReadonlyArray<string>;
        stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
        infraLinks: ReadonlyArray<
          RouteInfraLink<InfrastructureLinkAllFieldsFragment>
        >;
        geometry?: GeoJSON.LineString;
      }) => ({
        payload: mapToStoreType({
          includedStopLabels,
          stopsEligibleForJourneyPattern,
          infraLinks,
          geometry,
        }),
      }),
    },
    /**
     * Set draft route journey pattern
     */
    setDraftRouteJourneyPattern: (
      state,
      action: PayloadAction<JourneyPattern>,
    ) => ({
      ...state,
      editedRouteData: {
        ...state.editedRouteData,
        journeyPattern: action.payload,
      },
    }),
    /**
     * Reset created / edited route geometry in state.
     */
    resetDraftRouteGeometry: (state) => {
      state.editedRouteData = {
        ...state.editedRouteData,
        includedStopLabels: [],
        journeyPattern: { id: undefined, stops: [] },
        stopsEligibleForJourneyPattern: [],
        infraLinks: [],
        geometry: undefined,
      };
    },
    /**
     * Select a route by id.
     */
    setSelectedRouteId: (state, action: PayloadAction<UUID | undefined>) => {
      state.selectedRouteId = action.payload;
    },
    /**
     * Set the label of the most recently created route.
     */
    setLastCreatedRouteLabel: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.lastCreatedRouteLabel = action.payload;
    },
    /**
     * Set route metadata edit form open / closed.
     */
    setRouteMetadataFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isRouteMetadataFormOpen = action.payload;
    },
    /**
     * Toggle suppression for rehydrating geometry/snapping from base route data.
     */
    setSuppressBaseRouteRehydrate: (state, action: PayloadAction<boolean>) => {
      state.suppressBaseRouteRehydrate = action.payload;
    },
    /**
     * Emit an edge-trigger for explicit route-geometry deletes.
     * This allows effects to react on every delete, even when suppression
     * flag stays `true` across redraw cycles.
     */
    markRouteGeometryDeleted: (state) => {
      state.routeGeometryDeleteVersion += 1;
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
  setLastCreatedRouteLabel: setLastCreatedRouteLabelAction,
  setRouteMetadataFormOpen: setRouteMetadataFormOpenAction,
  setDraftRouteJourneyPattern: setDraftRouteJourneyPatternAction,
  setRouteToEditMode: setRouteToEditModeAction,
  setRouteToDrawMode: setRouteToDrawModeAction,
  startExistingRouteRedraw: startExistingRouteRedrawAction,
  stopExistingRouteRedraw: stopExistingRouteRedrawAction,
  setSuppressBaseRouteRehydrate: setSuppressBaseRouteRehydrateAction,
  markRouteGeometryDeleted: markRouteGeometryDeletedAction,
} = slice.actions;

export const mapRouteEditorReducer = slice.reducer;
