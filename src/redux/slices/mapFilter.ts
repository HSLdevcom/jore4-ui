import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { setMapObservationDateAction } from '../actions/mapFilter';

export enum FilterType {
  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
}

export interface Filter {
  type: FilterType;
  enabled: boolean;
}

export interface IState {
  showStopFilterOverlay: boolean;
  stopFilters: Filter[];
  observationDate: string;
}

const initialState: IState = {
  showStopFilterOverlay: false,
  stopFilters: [
    {
      type: FilterType.ShowFutureStops,
      enabled: false,
    },
    {
      type: FilterType.ShowCurrentStops,
      enabled: true,
    },
    {
      type: FilterType.ShowPastStops,
      enabled: false,
    },
  ],
  observationDate: DateTime.now().toISO(),
};

const slice = createSlice({
  name: 'mapFilter',
  initialState,
  reducers: {
    setShowStopFilterOverlay: (state, action: PayloadAction<boolean>) => {
      state.showStopFilterOverlay = action.payload;
    },
    setStopFilters: (state, action: PayloadAction<Filter[]>) => {
      state.stopFilters = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(
      setMapObservationDateAction,
      (state, action: PayloadAction<string>) => {
        state.observationDate = action.payload;
      },
    );
  },
});

export const {
  setShowStopFilterOverlay: setShowStopFilterOverlayAction,
  setStopFilters: setStopFiltersAction,
} = slice.actions;

export const mapFilterReducer = slice.reducer;
