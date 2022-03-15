import produce from 'immer';
import { DateTime } from 'luxon';
import { SetObservationDateAction } from './MapFilterActions';

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
  observationDate: DateTime;
}

export const initialState: IMapFilterContext = {
  showStopFilterOverlay: false,
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
  observationDate: DateTime.now(),
};

type SetStateAction = {
  type: 'setState';
  payload?: Partial<IMapFilterContext>;
};

export type MapFilterActions = SetStateAction | SetObservationDateAction;

const reducerFunction = (
  draft: IMapFilterContext,
  action: MapFilterActions,
): IMapFilterContext => {
  const { type, payload } = action;

  // note: with the use or 'immer', we can modify the state object directly
  switch (type) {
    case 'setState':
      return { ...draft, ...payload };
    case 'setObservationDate':
      return { ...draft, observationDate: payload as DateTime };
    default:
  }
  return draft;
};

export const mapFilterReducer = produce(reducerFunction);
