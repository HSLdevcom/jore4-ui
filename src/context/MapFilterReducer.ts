import produce from 'immer';

export enum FilterType {
  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
}

export interface Filter {
  type: FilterType;
  enabled: boolean;
}

export interface IMapFilterContext {
  showStopFilterOverlay: boolean;
  stopFilters: Filter[];
  observationDate: string;
}

export const initialState: IMapFilterContext = {
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
  observationDate: new Date().toISOString().split('T')[0], // Date in yyyy-mm-dd format
};

export type MapFilterActions = 'setState';

const reducerFunction = (
  draft: IMapFilterContext,
  action: {
    type: MapFilterActions;
    payload?: Partial<IMapFilterContext>;
  },
) => {
  const { type, payload } = action;

  // note: with the use or 'immer', we can modify the state object directly
  switch (type) {
    case 'setState':
      return { ...draft, ...payload };
    default:
  }
  return draft;
};

export const mapFilterReducer = produce(reducerFunction);
