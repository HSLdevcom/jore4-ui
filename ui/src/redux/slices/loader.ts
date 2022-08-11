import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Operation {
  LoadMap = 'loadMap',
  FetchStops = 'fetchStops',
  SaveStop = 'saveStop',
  SaveRoute = 'saveRoute',
  MatchRoute = 'matchRoute',
  CheckBrokenRoutes = 'checkBrokenRoutes',
}

export const mapOperations = [
  Operation.LoadMap,
  Operation.FetchStops,
  Operation.SaveStop,
  Operation.SaveRoute,
  Operation.MatchRoute,
  Operation.CheckBrokenRoutes,
];

type IState = {
  [key in Operation]: boolean;
};

const initialState: IState = {
  [Operation.LoadMap]: false,
  [Operation.FetchStops]: false,
  [Operation.SaveStop]: false,
  [Operation.SaveRoute]: false,
  [Operation.MatchRoute]: false,
  [Operation.CheckBrokenRoutes]: false,
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
