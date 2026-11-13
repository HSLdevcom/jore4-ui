import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export enum MapEntityType {
  Stop = 'show-stops',
  StopArea = 'show-stop-areas',
  StopLabel = 'show-stop-labels',
  Terminal = 'show-terminals',
  InfoSpot = 'show-info-spots',
  BusNetwork = 'show-bus-network',
  TramNetwork = 'show-tram-network',
}

export enum FilterType {
  ShowFuture = 'show-future',
  ShowCurrent = 'show-current',
  ShowPast = 'show-past',
  ShowStandard = 'show-standard',
  ShowTemporary = 'show-temporary',
  ShowDraft = 'show-draft',
  ShowHighestPriorityCurrent = 'show-highest-priority-current',
  ShowAllBusStops = 'show-all-bus-stops',
  ShowAllTramStops = 'show-all-tram-stops',
}

export type ShownMapEntityTypes = {
  [key in MapEntityType]: boolean;
};

export type ActiveTimeAndPriorityFilters = {
  [key in FilterType]: boolean;
};

export type IState = {
  readonly showMapEntityTypeFilterOverlay: boolean;
  readonly timeAndPriorityFilters: ActiveTimeAndPriorityFilters;
  readonly showMapEntityType: ShownMapEntityTypes;
};

const initialState: IState = {
  showMapEntityTypeFilterOverlay: false,
  timeAndPriorityFilters: {
    [FilterType.ShowFuture]: false,
    [FilterType.ShowCurrent]: true,
    [FilterType.ShowPast]: false,
    [FilterType.ShowStandard]: true,
    [FilterType.ShowTemporary]: true,
    [FilterType.ShowDraft]: false,
    [FilterType.ShowHighestPriorityCurrent]: true,
    [FilterType.ShowAllBusStops]: false,
    [FilterType.ShowAllTramStops]: false,
  },
  showMapEntityType: {
    [MapEntityType.Stop]: true,
    [MapEntityType.StopArea]: true,
    [MapEntityType.StopLabel]: false,
    [MapEntityType.Terminal]: true,
    [MapEntityType.InfoSpot]: false,
    [MapEntityType.BusNetwork]: false,
    [MapEntityType.TramNetwork]: false,
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
    setTimeAndPriorityFilters: (
      state,
      action: PayloadAction<ActiveTimeAndPriorityFilters>,
    ) => {
      state.timeAndPriorityFilters = action.payload;
    },
    setTimeAndPriorityFilter: (
      state,
      action: PayloadAction<{ filterType: FilterType; isActive: boolean }>,
    ) => {
      const { filterType, isActive } = action.payload;
      state.timeAndPriorityFilters[filterType] = isActive;
    },
    setShowMapEntityTypes: (
      state,
      action: PayloadAction<ShownMapEntityTypes>,
    ) => {
      state.showMapEntityType = action.payload;
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
  setTimeAndPriorityFilters: setTimeAndPriorityFiltersAction,
  setTimeAndPriorityFilter: setTimeAndPriorityFilterAction,
  setShowMapEntityType: setShowMapEntityTypeAction,
  setShowMapEntityTypes: setShowMapEntityTypesAction,
} = slice.actions;

export const mapFilterReducer = slice.reducer;
