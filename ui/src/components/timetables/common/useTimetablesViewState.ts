import { useMemo } from 'react';
import { QueryParameterName, useUrlQuery } from '../../../hooks';

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
    deleteMultipleFromUrlQuery,
  } = useUrlQuery();

  const activeView = useMemo(
    () =>
      getStringParamFromUrlQuery(QueryParameterName.TimetablesViewName) ??
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

  const setDayType = (newDayType: string, replace = false) => {
    setToUrlQuery({
      paramName: QueryParameterName.DayType,
      value: newDayType,
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

  const setShowDefaultView = () => {
    deleteMultipleFromUrlQuery({
      paramNames: [
        QueryParameterName.TimetablesViewName,
        QueryParameterName.RouteLabels,
        QueryParameterName.DayType,
      ],
    });
  };

  const routeLabel = routeLabels?.length ? routeLabels[0] : '';

  return {
    activeView,
    setActiveView,
    setDayType,
    setShowPassingTimesByStop,
    setShowDefaultView,
    routeLabel,
    dayType,
  };
};
