import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Viewport } from '../types/modalMap';

export const HELSINKI_CITY_CENTER_COORDINATES = {
  latitude: 60.1716,
  longitude: 24.9409,
};

// TODO: It would make more sense to read this from the map itself
// or then just default this to a non-magic value such as 0.
// Default stops to be shown on map are fetched according to this value.
const DEFAULT_VIEWPORT_RADIUS = 3800;

interface IState {
  isOpen: boolean;
  viewport: Viewport;
}

const initialState: IState = {
  isOpen: false,
  viewport: {
    ...HELSINKI_CITY_CENTER_COORDINATES,
    radius: DEFAULT_VIEWPORT_RADIUS,
  },
};

const slice = createSlice({
  name: 'modalMap',
  initialState,
  reducers: {
    setViewPort: (state, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },
  },
});

export const { setViewPort: setViewPortAction } = slice.actions;

export const modalMapReducer = slice.reducer;
