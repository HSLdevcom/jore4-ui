import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Viewport } from '../types/modalMap';

export const HELSINKI_CITY_CENTER_COORDINATES = {
  latitude: 60.1716,
  longitude: 24.9409,
};

interface IState {
  isOpen: boolean;
  viewport: Viewport;
  isLoading: boolean;
}

const initialState: IState = {
  isOpen: false,
  viewport: { ...HELSINKI_CITY_CENTER_COORDINATES, radius: 0 },
  isLoading: false,
};

const slice = createSlice({
  name: 'modalMap',
  initialState,
  reducers: {
    setViewPort: (state: IState, action: PayloadAction<Viewport>) => {
      state.viewport = action.payload;
    },
    reset: () => {
      return initialState;
    },
    setLoading: (state: IState, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setViewPort: setViewPortAction,
  reset: resetModalMapAction,
  setLoading: setModalMapLoadingAction,
} = slice.actions;

export const modalMapReducer = slice.reducer;
