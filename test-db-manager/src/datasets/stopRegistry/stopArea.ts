import { DateTime } from 'luxon';
import {
  StopRegistryGeoJsonType,
  StopRegistryGroupOfStopPlacesInput,
} from '../../generated/graphql';

export type StopAreaSeedData = {
  label: string;
  name: string;
  locationLat: number;
  locationLong: number;
  validityStart: DateTime;
  validityEnd?: DateTime;
  members: Array<string>;
};

export type StopAreaInput = {
  memberLabels: Array<string>;
  stopArea: Partial<StopRegistryGroupOfStopPlacesInput>;
};

const mapToStopAreaInput = (seedStopArea: StopAreaSeedData): StopAreaInput => {
  return {
    memberLabels: seedStopArea.members,
    stopArea: {
      name: {
        lang: 'fin',
        value: seedStopArea.label,
      },
      description: {
        lang: 'fin',
        value: seedStopArea.name,
      },
      validBetween: {
        fromDate: seedStopArea.validityStart.toISO(),
        toDate: seedStopArea.validityEnd?.toISO() || null,
      },
      geometry: seedStopArea.locationLat &&
        seedStopArea.locationLong && {
          coordinates: [[seedStopArea.locationLong, seedStopArea.locationLat]],
          type: StopRegistryGeoJsonType.Point,
        },
    },
  };
};

const finnooSeedData: StopAreaSeedData = {
  label: 'X1234',
  name: 'Finnoo',
  validityStart: DateTime.fromISO('2020-01-01T00:00:00.001'),
  validityEnd: DateTime.fromISO('2050-01-01T00:00:00.001'),
  locationLong: 24.708,
  locationLat: 60.156,
  members: ['E4464', 'E4461'],
};

const seedData: Array<StopAreaSeedData> = [finnooSeedData];

export const seedStopAreas: Array<StopAreaInput> =
  seedData.map(mapToStopAreaInput);
