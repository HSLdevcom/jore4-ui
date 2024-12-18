import { DateTime } from 'luxon';
import {
  StopRegistryGeoJsonType,
  StopRegistryGroupOfStopPlacesInput,
  StopRegistryInterchangeWeightingType,
  StopRegistryNameType,
  StopRegistrySubmodeType,
} from '../../generated/graphql';
import { StopPlaceMaintenance } from './stopPlaces';

export type StopAreaSeedData = {
  nameFin?: string;
  nameSwe?: string;
  nameFinLong?: string;
  nameSweLong?: string;
  abbreviationFin?: string;
  abbreviationSwe?: string;
  abbreviationFin5Char?: string;
  abbreviationSwe5Char?: string;
  label: string;
  name: string;
  organisations?: StopPlaceMaintenance;
  locationLat: number;
  locationLong: number;
  stopType?: {
    mainLine: boolean;
    interchange: boolean;
    railReplacement: boolean;
    virtual: boolean;
  };
  signs?: {
    signType: string /* see StopPlaceSignType */;
    note?: string;
    numberOfFrames: number;
    lineSignage: boolean;
    mainLineSign: boolean;
    replacesRailSign: boolean;
  };
};

export type StopAreaInput = {
  stopArea: Partial<StopRegistryGroupOfStopPlacesInput>;
};

const mapToStopAreaInput = (seedStopArea: StopAreaSeedData): StopAreaInput => {
  return {
    stopArea: {
      alternativeNames: [
        seedStopArea.abbreviationFin5Char
          ? {
              name: { lang: 'fin', value: seedStopArea.abbreviationFin5Char },
              nameType: StopRegistryNameType.Label,
            }
          : null,
        seedStopArea.abbreviationSwe5Char
          ? {
              name: { lang: 'swe', value: seedStopArea.abbreviationSwe5Char },
              nameType: StopRegistryNameType.Label,
            }
          : null,
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
        value: seedStopArea.label,
      },
      organisations: seedStopArea.organisations ?? null,
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
      weighting: seedStopArea.stopType?.interchange
          ? StopRegistryInterchangeWeightingType.RecommendedInterchange
          : undefined,
      submode: seedStopAreas.signs?.railReplacement
          ? StopRegistrySubmodeType.RailReplacementBus
          : undefined,
    },
  };
};

const route35StopAreas: Array<StopAreaSeedData> = [
  {
    label: 'X1300',
    name: 'Munkkivuori',
    locationLat: 60.206001,
    locationLong: 24.879646,
  },
  {
    label: 'X1301',
    name: 'Luuvaniementie',
    locationLat: 60.205531,
    locationLong: 24.883556,
  },
  {
    label: 'X1302',
    name: 'Rakuunantie',
    locationLat: 60.20054,
    locationLong: 24.883959,
  },
];

const finnooSeedData: StopAreaSeedData = {
  nameFin: 'Finnoo',
  nameSwe: 'Finnoo',
  nameFinLong: 'Finnoo',
  nameSweLong: 'Finnoo',
  abbreviationFin: 'Finnoo',
  abbreviationSwe: 'Finnoo',
  abbreviationFin5Char: 'Finnoo',
  abbreviationSwe5Char: 'Finnoo',
  label: 'X1234',
  name: 'Finnoo',
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
