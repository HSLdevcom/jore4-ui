import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetMapRouteEditorStateAction } from '../slices/mapRouteEditor';
import { resetMapStopEditorStateAction } from '../slices/mapStopEditor';
import { resetModalMapAction } from '../slices/modalMap';

export const resetMapState = createAsyncThunk(
  'map/resetMapState',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(resetModalMapAction());
    thunkAPI.dispatch(resetMapRouteEditorStateAction());
    thunkAPI.dispatch(resetMapStopEditorStateAction());
  },
);
