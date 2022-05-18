import { createAction } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { StopWithLocation } from '../../graphql';

export interface StoreStop
  extends Omit<StopWithLocation, 'validity_start' | 'validity_end'> {
  // eslint-disable-next-line camelcase
  validity_start?: string;
  // eslint-disable-next-line camelcase
  validity_end?: string;
}

const mapStopToStoreStop = (stop: StopWithLocation): StoreStop => ({
  ...stop,
  validity_start: stop?.validity_start?.toISO(),
  validity_end: stop?.validity_end?.toISO(),
});

export const mapStoreStopToStop = (stop: StoreStop): StopWithLocation => ({
  ...stop,
  validity_start: stop?.validity_start
    ? DateTime.fromISO(stop?.validity_start)
    : undefined,
  validity_end: stop?.validity_end
    ? DateTime.fromISO(stop?.validity_end)
    : undefined,
});

export const setEditedStopDataAction = createAction(
  'map/setEditedStopData',
  (stop: StopWithLocation | undefined) => {
    return {
      payload: stop ? mapStopToStoreStop(stop) : undefined,
    };
  },
);
