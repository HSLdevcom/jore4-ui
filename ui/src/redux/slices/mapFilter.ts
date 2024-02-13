import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum FilterType {
  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
  ShowStandardStops = 'show-standard-stops',
  ShowTemporaryStops = 'show-temporary-stops',
  ShowDraftStops = 'show-draft-stops',
  ShowHighestPriorityCurrentStops = 'show-highest-priority-current-stops',
  ShowAllBusStops = 'show-all-bus-stops',
}

export interface IState {
  showStopFilterOverlay: boolean;
  stopFilters: {
    [key in FilterType]: boolean;
  };
}

const initialState: IState = {
  showStopFilterOverlay: false,
  stopFilters: {
    [FilterType.ShowFutureStops]: false,
    [FilterType.ShowCurrentStops]: true,
    [FilterType.ShowPastStops]: false,
    [FilterType.ShowStandardStops]: true,
    [FilterType.ShowTemporaryStops]: true,
    [FilterType.ShowDraftStops]: false,
    [FilterType.ShowHighestPriorityCurrentStops]: true,
    [FilterType.ShowAllBusStops]: false,
  },
};

const slice = createSlice({
  name: 'mapFilter',
  initialState,
  reducers: {
    setShowStopFilterOverlay: (
      state: IState,
      action: PayloadAction<boolean>,
    ) => {
      state.showStopFilterOverlay = action.payload;
    },
    setStopFilter: (
      state: IState,
      action: PayloadAction<{ filterType: FilterType; isActive: boolean }>,
    ) => {
      const { filterType, isActive } = action.payload;
      state.stopFilters[filterType] = isActive;
    },
  },
});

export const {
  setShowStopFilterOverlay: setShowStopFilterOverlayAction,
  setStopFilter: setStopFilterAction,
} = slice.actions;

export const mapFilterReducer = slice.reducer;
