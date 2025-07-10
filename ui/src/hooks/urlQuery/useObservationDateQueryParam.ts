import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ValidityPeriod } from '../../generated/graphql';
import { isDateInRange } from '../../time';
import { showWarningToast } from '../../utils';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

type Props = {
  readonly initialize?: boolean;
};

/**
 * Query parameter hook for setting and getting observationDate. Initialization
 * of this query parameter can be set to false if you don't want to initialize it.
 */
export const useObservationDateQueryParam = (
  { initialize }: Props = { initialize: true },
) => {
  const { getDateTimeFromUrlQuery, setDateTimeToUrlQuery, queryParams } =
    useUrlQuery();
  const { t } = useTranslation();

  const [defaultDate] = useState(DateTime.now().startOf('day'));

  /** Sets observationDate to URL query
   * replace flag can be given to replace the earlier url query instead
   * of pushing it. This affects how the back button or history.back() works.
   * If the history is replaced, it means that back button will not go to the
   * url which was replaced, but rather the one before it.
   */
  const setObservationDateToUrl = (date: DateTime, replace = false) => {
    setDateTimeToUrlQuery(
      { paramName: QueryParameterName.ObservationDate, value: date },
      { replace },
    );
  };

  // Memoize the actual value to prevent unnecessary updates
  const observationDate = useMemo(() => {
    try {
      return (
        getDateTimeFromUrlQuery(QueryParameterName.ObservationDate) ??
        defaultDate
      );
    } catch {
      // If parsing date fails, set default date
      setObservationDateToUrl(defaultDate, true);
      return defaultDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, getDateTimeFromUrlQuery]);

  const updateObservationDateByValidityPeriodIfNeeded = ({
    validity_start, // eslint-disable-line camelcase
    validity_end, // eslint-disable-line camelcase
    showToast = true,
  }: ValidityPeriod & { showToast?: boolean }) => {
    if (!isDateInRange(observationDate, validity_start, validity_end)) {
      // If validity_start is undefined, validity_end is defined,
      // otherwise observationDate would be within the validity period
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, camelcase
      setObservationDateToUrl(validity_start ?? validity_end!);

      if (showToast) {
        showWarningToast(t('filters.observationDateAdjusted'));
      }
    }
  };

  /** Determines and sets date to query parameters if it's not there */
  const initializeObservationDate = useCallback(async () => {
    if (!queryParams.observationDate || !observationDate) {
      setObservationDateToUrl(defaultDate, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, observationDate, queryParams.observationDate]);

  useEffect(() => {
    if (initialize) {
      initializeObservationDate();
    }
  }, [initialize, initializeObservationDate]);

  return {
    observationDate,
    setObservationDateToUrl,
    updateObservationDateByValidityPeriodIfNeeded,
  };
};
