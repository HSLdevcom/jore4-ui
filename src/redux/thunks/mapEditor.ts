import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Mode,
  startDrawRouteAction,
  startEditRouteAction,
  stopDrawRouteAction,
  stopEditRouteAction,
} from '../slices/mapEditor';
import { RootState } from '../store';

export const toggleDrawRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleDrawRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Draw) {
    thunkAPI.dispatch(stopDrawRouteAction());
  } else {
    thunkAPI.dispatch(startDrawRouteAction());
  }
});

export const toggleEditRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleEditRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Edit) {
    thunkAPI.dispatch(stopEditRouteAction());
  } else {
    thunkAPI.dispatch(startEditRouteAction());
  }
});
