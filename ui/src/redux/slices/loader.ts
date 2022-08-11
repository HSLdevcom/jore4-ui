import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Operation {
  LoadMap = 'loadMap',
  FetchStops = 'fetchStops',
  SaveStop = 'saveStop',
  SaveRoute = 'saveRoute',
  MatchRoute = 'matchRoute',
  CheckBrokenRoutes = 'checkBrokenRoutes',
}

interface IState {
  [Operation.LoadMap]: boolean;
  [Operation.FetchStops]: boolean;
  [Operation.SaveStop]: boolean;
  [Operation.SaveRoute]: boolean;
  [Operation.MatchRoute]: boolean;
  [Operation.CheckBrokenRoutes]: boolean;
}

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
