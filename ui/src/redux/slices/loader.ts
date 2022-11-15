import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Operation {
  LoadMap = 'loadMap',
  FetchStops = 'fetchStops',
  FetchRoutes = 'fetchRoutes',
  SaveStop = 'saveStop',
  SaveRoute = 'saveRoute',
  MatchRoute = 'matchRoute',
  CheckBrokenRoutes = 'checkBrokenRoutes',
  SaveTimingPlace = 'saveTimingPlace',
}

export const mapOperations = [
  Operation.LoadMap,
  Operation.FetchStops,
  Operation.FetchRoutes,
  Operation.SaveStop,
  Operation.SaveRoute,
  Operation.MatchRoute,
  Operation.CheckBrokenRoutes,
  Operation.SaveTimingPlace,
];

type IState = {
  [key in Operation]: boolean;
};

const initialState: IState = {
  [Operation.LoadMap]: false,
  [Operation.FetchStops]: false,
  [Operation.FetchRoutes]: false,
  [Operation.SaveStop]: false,
  [Operation.SaveRoute]: false,
  [Operation.MatchRoute]: false,
  [Operation.CheckBrokenRoutes]: false,
  [Operation.SaveTimingPlace]: false,
};

const slice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoading: (
      state: IState,
      action: PayloadAction<{ operation: Operation; isLoading: boolean }>,
    ) => {
      state[action.payload.operation] = action.payload.isLoading;
    },
  },
});

export const { setLoading: setLoadingAction } = slice.actions;

export const loaderReducer = slice.reducer;
