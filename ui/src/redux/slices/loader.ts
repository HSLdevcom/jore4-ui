import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum Operation {
  LoadMap = 'loadMap',
  FetchInfraLinksWithStops = 'fetchInfraLinksWithStops',
  FetchStopAreas = 'fetchStopAreas',
  FetchStops = 'fetchStops',
  FetchRoutes = 'fetchRoutes',
  SaveStop = 'saveStop',
  SaveStopArea = 'saveStopArea',
  SaveRoute = 'saveRoute',
  MatchRoute = 'matchRoute',
  CheckBrokenRoutes = 'checkBrokenRoutes',
  SaveTimingPlace = 'saveTimingPlace',
  ExportRoute = 'exportRoute',
  ConfirmTimetablesImport = 'confirmTimetablesImport',
  UploadFilesToHastusImport = 'uploadFilesToHastusImport',
  AbortImport = 'abortImport',
  FetchRouteTimetables = 'fetchRouteTimetables',
  DeleteTimetable = 'deleteTimetable',
  ResolveScheduledStopPoint = 'resolveScheduledStopPoint',
}

export enum LoadingState {
  NotLoading = 'notLoading',
  LowPriority = 'lowPriority',
  MediumPriority = 'mediumPriority',
  HighPriority = 'highPriority',
}

export function getHighestLoadingState(
  loadingStates: ReadonlyArray<LoadingState>,
): LoadingState {
  if (loadingStates.includes(LoadingState.HighPriority)) {
    return LoadingState.HighPriority;
  }

  if (loadingStates.includes(LoadingState.LowPriority)) {
    return LoadingState.LowPriority;
  }

  return LoadingState.NotLoading;
}

export const mapOperations = [
  Operation.LoadMap,
  Operation.FetchInfraLinksWithStops,
  Operation.FetchStopAreas,
  Operation.FetchStops,
  Operation.FetchRoutes,
  Operation.SaveStop,
  Operation.SaveStopArea,
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
