import { createAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

export const setMapObservationDateAction = createAction(
  'modalMap/setObservationDate',
  (date: DateTime) => {
    return {
      payload: date.toISO(),
    };
  },
);
