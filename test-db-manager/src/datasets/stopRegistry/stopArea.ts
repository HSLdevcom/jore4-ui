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
        fromDate: seedStopArea.validityStart,
        toDate: seedStopArea.validityEnd || null,
      },
      geometry: seedStopArea.locationLat &&
        seedStopArea.locationLong && {
          coordinates: [[seedStopArea.locationLong, seedStopArea.locationLat]],
          type: StopRegistryGeoJsonType.Point,
        },
    },
  };
};

const basicStart = DateTime.fromISO('2020-01-01T00:00:00.001');
const basicEnd = DateTime.fromISO('2050-01-01T00:00:00.001');

const route35StopAreas: Array<StopAreaSeedData> = [
  {
    label: 'X1300',
    name: 'Munkkivuori',
    locationLat: 60.206001,
    locationLong: 24.879646,
    validityStart: basicStart,
    validityEnd: basicEnd,
    members: ['H1398', 'H1416'],
  },
  {
    label: 'X1301',
    name: 'Luuvaniementie',
    locationLat: 60.205531,
    locationLong: 24.883556,
    validityStart: basicStart,
    validityEnd: basicEnd,
    members: ['H1451', 'H1452'],
  },
  {
    label: 'X1302',
    name: 'Rakuunantie',
    locationLat: 60.20054,
    locationLong: 24.883959,
    validityStart: basicStart,
    validityEnd: basicEnd,
    members: ['H1456', 'H1458'],
  },
];

const finnooSeedData: StopAreaSeedData = {
  label: 'X1234',
  name: 'Finnoo',
  validityStart: basicStart,
  validityEnd: basicEnd,
  locationLong: 24.708,
  locationLat: 60.156,
  members: ['E4464', 'E4461'],
};

const seedData: Array<StopAreaSeedData> = [...route35StopAreas, finnooSeedData];

export const seedStopAreas: Array<StopAreaInput> =
  seedData.map(mapToStopAreaInput);
