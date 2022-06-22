import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Mode,
  resetRouteCreatingAction,
  startRouteCreatingAction,
  startRouteEditingAction,
  stopRouteEditingAction,
} from '../slices/mapEditor';
import { RootState } from '../store';

export const toggleDrawRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleDrawRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Draw) {
    thunkAPI.dispatch(resetRouteCreatingAction());
  } else {
    thunkAPI.dispatch(startRouteCreatingAction());
  }
});

export const toggleEditRouteAction = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('mapEditor/toggleEditRoute', (_, thunkAPI) => {
  if (thunkAPI.getState().mapEditor.drawingMode === Mode.Edit) {
    thunkAPI.dispatch(stopRouteEditingAction());
  } else {
    thunkAPI.dispatch(startRouteEditingAction());
  }
});
