import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum Operation {
  LoadMap = 'loadMap',
  FetchInfraLinksWithStops = 'fetchInfraLinksWithStops',
  FetchStopAreaDetails = 'fetchStopAreaDetails',
  FetchStopAreaPageDetails = 'fetchStopAreaPageDetails',
  FetchStopAreas = 'fetchStopAreas',
  FetchTerminalDetails = 'fetchTerminalDetails',
  FetchTerminalPageDetails = 'fetchTerminalPageDetails',
  FetchTerminals = 'fetchTerminals',
  FetchStops = 'fetchStops',
  FetchStopInfo = 'fetchStopInfo',
  FetchRoutes = 'fetchRoutes',
  SaveStop = 'saveStop',
  SaveRoute = 'saveRoute',
  MatchRoute = 'matchRoute',
  ModifyStopArea = 'modifyStopArea',
  ModifyTerminal = 'modifyTerminal',
  CheckBrokenRoutes = 'checkBrokenRoutes',
  SaveTimingPlace = 'saveTimingPlace',
  ExportRoute = 'exportRoute',
  ConfirmTimetablesImport = 'confirmTimetablesImport',
  UploadFilesToHastusImport = 'uploadFilesToHastusImport',
  AbortImport = 'abortImport',
  FetchRouteTimetables = 'fetchRouteTimetables',
  DeleteTimetable = 'deleteTimetable',
  ResolveScheduledStopPoint = 'resolveScheduledStopPoint',
  UpdateRouteJourneyPattern = 'updateRouteJourneyPattern',
}

/**
 * Alternatively LoadingPriority.
 * Should the spinner for the {@link Operation} be hidden, or should be shown
 * based on the set priority.
 */
export enum LoadingState {
  /** No spinner should be visible */
  NotLoading = 'notLoading',

  /** Spinner would be a distraction to the user.
   *  Prefer to silently load data on the background.
   *  Only show spinner if loading takes a real long time.
   * */
  LowPriority = 'lowPriority',

  /** Network operation should complete quickly,
   * but if it doesn't it would confuse the user.
   * Thus spinner should be shown soonish.
   * */
  MediumPriority = 'mediumPriority',

  /** Block further user action immediately, until network operation is done. */
  HighPriority = 'highPriority',
}

export function getHighestLoadingState(
  loadingStates: ReadonlyArray<LoadingState>,
): LoadingState {
  if (loadingStates.includes(LoadingState.HighPriority)) {
    return LoadingState.HighPriority;
  }

  if (loadingStates.includes(LoadingState.MediumPriority)) {
    return LoadingState.MediumPriority;
  }

  if (loadingStates.includes(LoadingState.LowPriority)) {
    return LoadingState.LowPriority;
  }

  return LoadingState.NotLoading;
}

export const mapOperations = [
  Operation.LoadMap,
  Operation.FetchInfraLinksWithStops,
  Operation.FetchStopAreaDetails,
  Operation.FetchStopAreas,
  Operation.FetchStops,
  Operation.FetchStopInfo,
  Operation.FetchRoutes,
  Operation.SaveStop,
  Operation.ModifyStopArea,
  Operation.SaveRoute,
  Operation.MatchRoute,
  Operation.CheckBrokenRoutes,
  Operation.SaveTimingPlace,
  Operation.ResolveScheduledStopPoint,
];

export const importOperations = [
  Operation.ConfirmTimetablesImport,
  Operation.UploadFilesToHastusImport,
  Operation.AbortImport,
];

export const joreOperations = [
  ...importOperations,
  Operation.ExportRoute,
  Operation.DeleteTimetable,
  Operation.UpdateRouteJourneyPattern,
];

type IState = {
  [key in Operation]: LoadingState;
};

const initialState: IState = Object.values(Operation).reduce(
  (state: IState, operation) => ({
    ...state,
    [operation]: LoadingState.NotLoading,
  }),
  {} as IState,
);

const slice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoading: (
      state: IState,
      action: PayloadAction<{ operation: Operation; isLoading: boolean }>,
    ) => {
      state[action.payload.operation] = action.payload.isLoading
        ? LoadingState.HighPriority
        : LoadingState.NotLoading;
    },
    setLoadingState: (
      state: IState,
      action: PayloadAction<{ operation: Operation; state: LoadingState }>,
    ) => {
      state[action.payload.operation] = action.payload.state;
    },
  },
});

export const {
  setLoading: setLoadingAction,
  setLoadingState: setLoadingStateAction,
} = slice.actions;

export const loaderReducer = slice.reducer;
