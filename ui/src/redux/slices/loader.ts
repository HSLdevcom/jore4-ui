import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { LoadingState } from '../../types';

export enum Operation {
  LoadMap = 'loadMap',
  LoadMapData = 'loadMapData',
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
  DeleteStop = 'deleteStop',
  SaveRoute = 'saveRoute',
  PrepareRouteDraw = 'prepareRouteDraw',
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
  UpdateLine = 'updateLine',
  CreateMirrorQuay = 'createMirrorQuay',
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
  Operation.LoadMapData,
  Operation.FetchInfraLinksWithStops,
  Operation.FetchStopAreaDetails,
  Operation.FetchStopAreas,
  Operation.FetchStops,
  Operation.FetchStopInfo,
  Operation.FetchRoutes,
  Operation.SaveStop,
  Operation.DeleteStop,
  Operation.ModifyStopArea,
  Operation.SaveRoute,
  Operation.PrepareRouteDraw,
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
  Operation.UpdateLine,
  Operation.CreateMirrorQuay,
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
