import produce from 'immer';
import { DateTime } from 'luxon';
import { FilterType, IMapFilterContext, MapFilterActions } from './types';

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
  observationDate: DateTime.now(),
};

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
