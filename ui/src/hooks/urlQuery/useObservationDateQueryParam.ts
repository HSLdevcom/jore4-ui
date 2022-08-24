import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUrlQuery } from './useUrlQuery';

export const useObservationDateQueryParam = () => {
  const { getDateTimeFromUrlQuery, setDateTimeToUrlQuery, queryParams } =
    useUrlQuery();

  const [defaultDate] = useState(DateTime.now().startOf('day'));

  /** Sets observationDate to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setObservationDateToUrl = (date: DateTime, replace = false) => {
    setDateTimeToUrlQuery(
      { paramName: 'observationDate', value: date },
      { replace },
    );
  };

  // Memoize the actual value to prevent unnecessary updates
  const observationDate = useMemo(() => {
    try {
      return getDateTimeFromUrlQuery('observationDate') || defaultDate;
    } catch {
      // If parsing date fails, set default date
      setObservationDateToUrl(defaultDate, true);
      return defaultDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, getDateTimeFromUrlQuery]);

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!queryParams.observationDate || !observationDate) {
      setObservationDateToUrl(defaultDate, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, observationDate, queryParams.observationDate]);

  useEffect(() => {
    initializeObservationDate();
  }, [initializeObservationDate]);

  return { observationDate, setObservationDateToUrl };
};
