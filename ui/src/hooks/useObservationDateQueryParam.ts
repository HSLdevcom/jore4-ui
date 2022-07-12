import { useMemo } from 'react';
import { parseDate } from '../time';
import { useSetToUrlQuery } from './useSetToUrlQuery';
import { useUrlQuery } from './useUrlQuery';

export const useObservationDateQueryParam = () => {
  const queryParams = useUrlQuery();
  const setToUrlQuery = useSetToUrlQuery();

  // Memoize the actual value to prevent unnecessary updates
  const observationDate = useMemo(
    () => parseDate(queryParams.observationDate as string),
    [queryParams.observationDate],
  );

  /** Sets observationDate to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setObservationDateToUrl = (date: string, replace = false) => {
    setToUrlQuery({ paramName: 'observationDate', value: date, replace });
  };

  return { observationDate, setObservationDateToUrl };
};
