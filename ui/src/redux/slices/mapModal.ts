import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Viewport } from '../types';

type Mutable<T> = { -readonly [P in keyof T]: Mutable<T[P]> };
type MutableViewport = Mutable<Viewport>;

export const HELSINKI_CITY_CENTER_COORDINATES = {
  latitude: 60.1716,
  longitude: 24.9409,
};

type IState = {
  readonly isOpen: boolean;
  readonly viewport: Viewport;
};

const initialState: IState = {
  isOpen: false,
  viewport: {
    ...HELSINKI_CITY_CENTER_COORDINATES,
    bounds: [
      [0, 0],
      [0, 0],
    ],
  },
};

const slice = createSlice({
  name: 'mapModal',
  initialState,
  reducers: {
    setViewPort: (state, action: PayloadAction<MutableViewport>) => {
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
