import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetMapModalAction } from '../slices/mapModal';
import { resetMapRouteEditorStateAction } from '../slices/mapRouteEditor';
import { resetMapStopEditorStateAction } from '../slices/mapStopEditor';

export const resetMapState = createAsyncThunk(
  'map/resetMapState',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(resetMapModalAction());
    thunkAPI.dispatch(resetMapRouteEditorStateAction());
    thunkAPI.dispatch(resetMapStopEditorStateAction());
  },
);
