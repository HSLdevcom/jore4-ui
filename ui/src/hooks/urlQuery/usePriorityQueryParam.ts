import { useCallback, useEffect, useMemo, useState } from 'react';
import { Priority } from '../../types/enums';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

interface Props {
  initialize?: boolean;
}

/**
 * Query parameter hook for setting and getting priority.
 */
export const usePriorityQueryParam = (
  { initialize }: Props = { initialize: false },
) => {
  const { getPriorityArrayFromUrlQuery, setToUrlQuery, queryParams } =
    useUrlQuery();

  const [defaultPriority] = useState(Priority.Standard);

  /** Sets priority to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setPriorityToUrl = useCallback(
    (priority: Priority, replace = false) => {
      setToUrlQuery({
        paramName: QueryParameterName.StopPriority,
        value: priority.toString(),
        replace,
      });
    },
    [setToUrlQuery],
  );

  // Memoize the actual value to prevent unnecessary updates
  const priority = useMemo(() => {
    try {
      const priorities = getPriorityArrayFromUrlQuery(
        QueryParameterName.StopPriority,
      );

      if (priorities && priorities.length > 0) {
        return priorities[0];
      }

      return defaultPriority;
    } catch {
      // If parsing date fails, set default date
      setPriorityToUrl(defaultPriority, true);
      return defaultPriority;
    }
  }, [defaultPriority, getPriorityArrayFromUrlQuery, setPriorityToUrl]);

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!queryParams.priority || !priority) {
      setPriorityToUrl(defaultPriority, true);
    }
  }, [defaultPriority, priority, queryParams.priority, setPriorityToUrl]);

  useEffect(() => {
    if (initialize) {
      initializeObservationDate();
    }
  }, [initialize, initializeObservationDate]);

  return {
    priority,
    setPriorityToUrl,
  };
};
