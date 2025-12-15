import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Viewport } from '../types';

type Mutable<T> = { -readonly [P in keyof T]: Mutable<T[P]> };
export type MutableViewport = Mutable<Viewport>;

export const HELSINKI_CITY_CENTER_COORDINATES = {
  latitude: 60.1716,
  longitude: 24.9409,
};

type MapStopSelectionByResultSelection = {
  readonly byResultSelection: true;
};

type MapStopSelectionByIds = {
  readonly byResultSelection: false;
  readonly selected: ReadonlyArray<string>;
};

export type MapStopSelection =
  | MapStopSelectionByResultSelection
  | MapStopSelectionByIds;

type MapModalState = {
  readonly isOpen: boolean;
  readonly viewport: Viewport;
  readonly stopSelection: MapStopSelection;
};

export const defaultViewPort: Viewport = {
  ...HELSINKI_CITY_CENTER_COORDINATES,
  bounds: [
    [0, 0],
    [0, 0],
  ],
};

const initialState: MapModalState = {
  isOpen: false,
  viewport: defaultViewPort,
  // Start in result selection mode, set to "byList" mode by the component
  // that initiated the navigation onto the map page, or converted into that mode
  // by the selection component, if it detects no applied filters on mount.
  stopSelection: { byResultSelection: true },
};

const slice = createSlice({
  name: 'mapModal',
  initialState,
  reducers: {
    setViewPort: (state, action: PayloadAction<MutableViewport>) => {
      state.viewport = action.payload;
    },

    setStopSelection: (
      state,
      action: PayloadAction<Mutable<MapStopSelection>>,
    ) => {
      state.stopSelection = action.payload;
    },

    toggleStopSelection: (state, action: PayloadAction<string>) => {
      if (state.stopSelection.byResultSelection) {
        throw new Error(
          'Stop selection must be in "byId" state before single stops status can be changed!',
        );
      }

      const id = action.payload;
      if (state.stopSelection.selected.includes(id)) {
        state.stopSelection.selected = state.stopSelection.selected.filter(
          (it) => it !== id,
        );
      } else {
        state.stopSelection.selected.push(id);
      }
    },

    reset: () => initialState,
  },
});

export const {
  setViewPort: setViewPortAction,
  setStopSelection: setStopSelectionAction,
  toggleStopSelection: toggleStopSelectionAction,
  reset: resetMapModalAction,
} = slice.actions;

export const mapModalReducer = slice.reducer;
