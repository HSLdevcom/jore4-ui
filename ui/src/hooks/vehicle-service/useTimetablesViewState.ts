import { useMemo } from 'react';
import { QueryParameterName, useUrlQuery } from '../urlQuery';

export enum TimetablesView {
  DEFAULT = '',
  PASSING_TIMES_BY_STOP = 'passingTimesByStop',
}

/**
 * Hook for handling timetables view state (using query parameters)
 * Keeps track of which view is visible (e.g. default, passing times by stops etc.),
 * which route or day types are selected etc.
 */
export const useTimetablesViewState = () => {
  const {
    getStringParamFromUrlQuery,
    setToUrlQuery,
    setMultipleParametersToUrlQuery,
    getArrayFromUrlQuery,
  } = useUrlQuery();

  const activeView = useMemo(
    () =>
      getStringParamFromUrlQuery(QueryParameterName.TimetablesViewName) ||
      TimetablesView.DEFAULT,
    [getStringParamFromUrlQuery],
  );

  const routeLabels = getArrayFromUrlQuery(QueryParameterName.RouteLabels);
  const dayType = getStringParamFromUrlQuery(QueryParameterName.DayType);

  const setActiveView = (view: TimetablesView, replace = false) => {
    setToUrlQuery({
      paramName: QueryParameterName.TimetablesViewName,
      value: view,
      replace,
    });
  };

  const setShowPassingTimesByStop = (
    routeLabel: string,
    newDayType: string,
  ) => {
    setMultipleParametersToUrlQuery({
      parameters: [
        {
          paramName: QueryParameterName.TimetablesViewName,
          value: TimetablesView.PASSING_TIMES_BY_STOP,
        },
        {
          paramName: QueryParameterName.RouteLabels,
          value: [routeLabel],
        },
        { paramName: QueryParameterName.DayType, value: newDayType },
      ],
    });
  };

  return {
    activeView,
    setActiveView,
    setShowPassingTimesByStop,
    routeLabels,
    dayType,
  };
};
