import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Maybe } from '../../generated/graphql';
import { isDateInRange } from '../../time';
import { showWarningToast } from '../../utils';
import { QueryParameterName } from './useMapQueryParams';
import { useUrlQuery } from './useUrlQuery';

export const useObservationDateQueryParam = () => {
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
        getDateTimeFromUrlQuery(QueryParameterName.ObservationDate) ||
        defaultDate
      );
    } catch {
      // If parsing date fails, set default date
      setObservationDateToUrl(defaultDate, true);
      return defaultDate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate, getDateTimeFromUrlQuery]);

  const ensureVisibilityByValidityPeriod = ({
    // eslint-disable-next-line camelcase
    validity_start,
    // eslint-disable-next-line camelcase
    validity_end,
  }: {
    // eslint-disable-next-line camelcase
    validity_start?: Maybe<DateTime> | undefined;
    // eslint-disable-next-line camelcase
    validity_end?: Maybe<DateTime> | undefined;
  }) => {
    if (!isDateInRange(observationDate, validity_start, validity_end)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, camelcase
      setObservationDateToUrl(validity_start!);
      showWarningToast(t('filters.observationDateAdjusted'));
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
    initializeObservationDate();
  }, [initializeObservationDate]);

  return {
    observationDate,
    setObservationDateToUrl,
    ensureVisibilityByValidityPeriod,
  };
};
