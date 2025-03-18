import {
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  StopRegistryTransportModeType,
} from '../../generated/graphql';
import { StopPlaceMaintenance } from './stopPlaces';
import { getKeyValue } from './utils';

export type StopAreaSeedData = {
  nameSwe?: string;
  nameFinLong?: string;
  nameSweLong?: string;
  abbreviationFin?: string;
  abbreviationSwe?: string;
  label: string;
  name: string;
  organisations?: StopPlaceMaintenance;
  locationLat: number;
  locationLong: number;
  validityStart: string; // Really a datetime, but keyValues can only take strings.
  validityEnd?: string; // Really a datetime, but keyValues can only take strings.
};

export type StopAreaInput = {
  StopArea: Partial<StopRegistryStopPlaceInput>;
  organisations: StopPlaceMaintenance | null;
};

const mapToStopAreaInput = (seedStopArea: StopAreaSeedData): StopAreaInput => {
  return {
    StopArea: {
      transportMode: StopRegistryTransportModeType.Bus,
      alternativeNames: [
        seedStopArea.nameFinLong
          ? {
              name: { lang: 'fin', value: seedStopArea.nameFinLong },
              nameType: StopRegistryNameType.Alias,
            }
          : null,
        seedStopArea.nameSweLong
          ? {
              name: { lang: 'swe', value: seedStopArea.nameSweLong },
              nameType: StopRegistryNameType.Alias,
            }
          : null,
        seedStopArea.abbreviationFin
          ? {
              name: { lang: 'fin', value: seedStopArea.abbreviationFin },
              nameType: StopRegistryNameType.Other,
            }
          : null,
        seedStopArea.abbreviationSwe
          ? {
              name: { lang: 'swe', value: seedStopArea.abbreviationSwe },
              nameType: StopRegistryNameType.Other,
            }
          : null,
        {
          name: { lang: 'swe', value: seedStopArea.nameSwe },
          nameType: StopRegistryNameType.Translation,
        },
      ],
      privateCode: { type: 'HSL', value: seedStopArea.label },
      name: {
        lang: 'fin',
        value: seedStopArea.name,
      },
      geometry:
        seedStopArea.locationLat && seedStopArea.locationLong
          ? {
              coordinates: [
                seedStopArea.locationLong,
                seedStopArea.locationLat,
              ],
              type: StopRegistryGeoJsonType.Point,
            }
          : null,
      keyValues: [
        getKeyValue('validityStart', seedStopArea.validityStart),
        getKeyValue('validityEnd', seedStopArea.validityEnd),
      ],
    },
    organisations: seedStopArea.organisations ?? null,
  };
};

const basicStart = '2020-01-01';
const basicEnd = '2050-01-01';

const route35StopAreas: Array<StopAreaSeedData> = [
  {
    label: 'X1300',
    name: 'Munkkivuori',
    locationLat: 60.206001,
    locationLong: 24.879646,
    validityStart: basicStart,
    validityEnd: basicEnd,
  },
  {
    label: 'X1301',
    name: 'Luuvaniementie',
    locationLat: 60.205531,
    locationLong: 24.883556,
    validityStart: basicStart,
    validityEnd: basicEnd,
  },
  {
    label: 'X1302',
    name: 'Rakuunantie 8',
    locationLat: 60.20054,
    locationLong: 24.883959,
    validityStart: basicStart,
    validityEnd: basicEnd,
  },
];

const finnooSeedData: StopAreaSeedData = {
  nameSwe: 'Finno',
  nameFinLong: 'Finnoo',
  nameSweLong: 'Finno',
  abbreviationFin: 'Finnoo',
  abbreviationSwe: 'Finno',
  label: 'X1234',
  name: 'Finnoo',
  validityStart: basicStart,
  validityEnd: basicEnd,
  locationLong: 24.708,
  locationLat: 60.156,
  organisations: {
    cleaning: 'Clear Channel',
    infoUpkeep: null,
    maintenance: 'ELY-keskus',
    owner: 'JCD',
    winterMaintenance: 'ELY-keskus',
  },
};

const seedData: Array<StopAreaSeedData> = [...route35StopAreas, finnooSeedData];

export const seedStopAreas: Array<StopAreaInput> =
  seedData.map(mapToStopAreaInput);
