import { DateTime } from 'luxon';

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

export type SetStateAction = {
  type: 'setState';
  payload?: Partial<IMapFilterContext>;
};

export type SetObservationDateAction = {
  type: 'setObservationDate';
  payload: DateTime;
};

export type MapFilterActions = SetStateAction | SetObservationDateAction;
