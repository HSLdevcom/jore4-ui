import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum MapEntityType {
  Stop = 'show-stops',
  StopArea = 'show-stop-areas',
  Terminal = 'show-terminals',
  InfoSpot = 'show-info-spots',
}

export enum FilterType {
  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
  ShowStandardStops = 'show-standard-stops',
  ShowTemporaryStops = 'show-temporary-stops',
  ShowDraftStops = 'show-draft-stops',
  ShowHighestPriorityCurrentStops = 'show-highest-priority-current-stops',
  ShowAllBusStops = 'show-all-bus-stops',
  ShowAllTramStops = 'show-all-tram-stops',
}

export type ShownMapEntityTypes = {
  [key in MapEntityType]: boolean;
};

export type ActiveStopFilters = {
  [key in FilterType]: boolean;
};

export type IState = {
  readonly showMapEntityTypeFilterOverlay: boolean;
  readonly stopFilters: ActiveStopFilters;
  readonly showMapEntityType: ShownMapEntityTypes;
};

const initialState: IState = {
  showMapEntityTypeFilterOverlay: false,
  stopFilters: {
    [FilterType.ShowFutureStops]: false,
    [FilterType.ShowCurrentStops]: true,
    [FilterType.ShowPastStops]: false,
    [FilterType.ShowStandardStops]: true,
    [FilterType.ShowTemporaryStops]: true,
    [FilterType.ShowDraftStops]: false,
    [FilterType.ShowHighestPriorityCurrentStops]: true,
    [FilterType.ShowAllBusStops]: false,
    [FilterType.ShowAllTramStops]: false,
  },
  showMapEntityType: {
    [MapEntityType.Stop]: true,
    [MapEntityType.StopArea]: true,
    [MapEntityType.Terminal]: true,
    [MapEntityType.InfoSpot]: false,
  },
};

const slice = createSlice({
  name: 'mapFilter',
  initialState,
  reducers: {
    setShowMapEntityTypeFilterOverlay: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.showMapEntityTypeFilterOverlay = action.payload;
    },
    setStopFilter: (
      state,
      action: PayloadAction<{ filterType: FilterType; isActive: boolean }>,
    ) => {
      const { filterType, isActive } = action.payload;
      state.stopFilters[filterType] = isActive;
    },
    setShowMapEntityType: (
      state,
      action: PayloadAction<{
        readonly entityType: MapEntityType;
        readonly shown: boolean;
      }>,
    ) => {
      const {
        payload: { entityType, shown },
      } = action;
      state.showMapEntityType[entityType] = shown;
    },
  },
});

export const {
  setShowMapEntityTypeFilterOverlay: setShowMapEntityTypeFilterOverlayAction,
  setStopFilter: setStopFilterAction,
  setShowMapEntityType: setShowMapEntityTypeAction,
} = slice.actions;

export const mapFilterReducer = slice.reducer;
