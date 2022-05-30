import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export enum FilterType {
  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
  ShowStandardStops = 'show-standard-stops',
  ShowTemporaryStops = 'show-temporary-stops',
  ShowDraftStops = 'show-draft-stops',
}

export interface IState {
  showStopFilterOverlay: boolean;
  stopFilters: {
    [key in FilterType]: boolean;
  };
  observationDate: string;
}

const initialState: IState = {
  showStopFilterOverlay: false,
  stopFilters: {
    [FilterType.ShowFutureStops]: false,
    [FilterType.ShowCurrentStops]: true,
    [FilterType.ShowPastStops]: false,
    [FilterType.ShowStandardStops]: true,
    [FilterType.ShowTemporaryStops]: true,
    [FilterType.ShowDraftStops]: true,
  },
  observationDate: DateTime.now().toISO(),
};

const slice = createSlice({
  name: 'mapFilter',
  initialState,
  reducers: {
    setShowStopFilterOverlay: (state, action: PayloadAction<boolean>) => {
      state.showStopFilterOverlay = action.payload;
    },
    setStopFilter: (
      state,
      action: PayloadAction<{ filterType: FilterType; enabled: boolean }>,
    ) => {
      const { filterType, enabled } = action.payload;
      state.stopFilters[filterType] = enabled;
    },
    setMapObservationDate: {
      reducer: (state, action: PayloadAction<string>) => {
        state.observationDate = action.payload;
      },
      prepare: (date: DateTime) => ({
        payload: date.toISO(),
      }),
    },
  },
});

export const {
  setShowStopFilterOverlay: setShowStopFilterOverlayAction,
  setStopFilter: setStopFilterAction,
  setMapObservationDate: setMapObservationDateAction,
} = slice.actions;

export const mapFilterReducer = slice.reducer;
