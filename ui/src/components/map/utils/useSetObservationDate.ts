import { useTranslation } from 'react-i18next';
import { isDateInRange, parseDate } from '../../../time';
import { EnrichedParentStopPlace, EnrichedStopPlace } from '../../../types';
import { showWarningToast } from '../../../utils';
import { useMapUrlStateContext } from './mapUrlState';

export const useSetMapObservationDate = () => {
  const { t } = useTranslation();

  const {
    state: {
      filters: { observationDate },
    },
    setFlatUrlState,
  } = useMapUrlStateContext();

  const setMapObservationDate = (
    stopPlace: EnrichedParentStopPlace | EnrichedStopPlace | null,
  ) => {
    const validityStart = parseDate(stopPlace?.validityStart);
    const validityEnd = parseDate(stopPlace?.validityEnd);

    if (!isDateInRange(observationDate, validityStart, validityEnd)) {
      setFlatUrlState((p) => ({
        ...p,
        observationDate: validityStart ?? validityEnd ?? observationDate,
      }));
      showWarningToast(t('filters.observationDateAdjusted'));
    }
  };

  return setMapObservationDate;
};
