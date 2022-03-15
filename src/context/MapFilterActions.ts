import { DateTime } from 'luxon';

export type SetObservationDateAction = {
  type: 'setObservationDate';
  payload: DateTime;
};

export const setObservationDate = (
  date: DateTime,
): SetObservationDateAction => {
  return { type: 'setObservationDate', payload: date };
};
