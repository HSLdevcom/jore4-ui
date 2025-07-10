import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

type Props = {
  readonly initialize?: boolean;
  readonly queryParamName: QueryParameterName;
  readonly initialDate?: DateTime;
};

/**
 * Query parameter hook for setting and getting date query parameter. Initialization
 * of this query parameter can be set to false if you don't want to initialize it.
 * TODO: This is currently partly copypasted from useObservationDateQueryParam, and
 * these could maybe be combined at least from some parts.
 */
export const useDateQueryParam = ({
  initialize = true,
  queryParamName,
  initialDate,
}: Props) => {
  const { getDateTimeFromUrlQuery, setDateTimeToUrlQuery, queryParams } =
    useUrlQuery();

  const [defaultDate] = useState(initialDate ?? DateTime.now().startOf('day'));

  /**
   * Sets date to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setDateToUrl = (date: DateTime, replace = false) => {
    setDateTimeToUrlQuery(
      { paramName: queryParamName, value: date },
      { replace },
    );
  };

  // Memoize the actual value to prevent unnecessary updates
  const date = useMemo(() => {
    try {
      return getDateTimeFromUrlQuery(queryParamName) ?? defaultDate;
    } catch {
      // If parsing date fails, set default date
      setDateToUrl(defaultDate, true);
      return defaultDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, getDateTimeFromUrlQuery]);

  /** Determines and sets date to query parameters if it's not there */
  const initializeDate = useCallback(async () => {
    if (!queryParams[queryParamName] || !date) {
      setDateToUrl(defaultDate, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, date, queryParams[queryParamName]]);

  useEffect(() => {
    if (initialize) {
      initializeDate();
    }
  }, [initialize, initializeDate, queryParams]);

  return {
    date,
    setDateToUrl,
  };
};
