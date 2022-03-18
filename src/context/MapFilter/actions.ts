import { DateTime } from 'luxon';
import {
  IMapFilterContext,
  SetObservationDateAction,
  SetStateAction,
} from './types';

export const setState = (
  state: Partial<IMapFilterContext>,
): SetStateAction => ({
  type: 'setState',
  payload: state,
});

export const setObservationDate = (
  date: DateTime,
): SetObservationDateAction => ({
  type: 'setObservationDate',
  payload: date,
});
