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
  stopFilters: Filter[];
}

export const initialState: IMapFilterContext = {
  stopFilters: [
    {
      type: FilterType.ShowFutureStops,
      enabled: true,
    },
    {
      type: FilterType.ShowCurrentStops,
      enabled: true,
    },
    {
      type: FilterType.ShowPastStops,
      enabled: true,
    },
  ],
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
