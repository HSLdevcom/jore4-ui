import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useUrlQuery } from './useUrlQuery';

export const useObservationDateQueryParam = () => {
  const { getDateTimeFromUrlQuery, setDateTimeToUrlQuery } = useUrlQuery();

  // Memoize the actual value to prevent unnecessary updates
  const observationDate = useMemo(
    () => getDateTimeFromUrlQuery('observationDate'),
    [getDateTimeFromUrlQuery],
  );

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

  return { observationDate, setObservationDateToUrl };
};
