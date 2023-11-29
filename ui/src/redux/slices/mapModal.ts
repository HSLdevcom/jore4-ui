import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Viewport } from '../types';

export const HELSINKI_CITY_CENTER_COORDINATES = {
  latitude: 60.1716,
  longitude: 24.9409,
};

interface IState {
  isOpen: boolean;
  viewport: Viewport;
}

const initialState: IState = {
  isOpen: false,
  viewport: { ...HELSINKI_CITY_CENTER_COORDINATES, radius: 0 },
};

const slice = createSlice({
  name: 'mapModal',
  initialState,
  reducers: {
    setViewPort: (state: IState, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },
    reset: () => {
      return initialState;
    },
  },
});

export const { setViewPort: setViewPortAction, reset: resetMapModalAction } =
  slice.actions;

export const mapModalReducer = slice.reducer;
