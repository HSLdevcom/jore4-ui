import {
  StopPlaceInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager';
import cloneDeepWith from 'lodash/cloneDeepWith';
import { DateTime } from 'luxon';
import { stopCoordinatesByLabel } from './base';

const coordinatesToStopRegistryGeoJSON = (
  coordinates: number[],
): StopRegistryGeoJson => {
  return {
    coordinates: coordinates.slice(0, 2),
    type: StopRegistryGeoJsonType.Point,
  };
};

const validBetween = {
  fromDate: DateTime.fromISO('2020-03-20'),
  toDate: null,
};

// Stop registry stopPlace data for each scheduled stop point in the base dataset.
const stopPlaceData: Array<StopPlaceInput> = [
  {
    label: 'E2E001',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 15' },
      quays: [{ publicCode: 'E2E001' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E001),
      validBetween,
    },
  },
  {
    label: 'E2E002',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E002' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E002),
      validBetween,
    },
  },
  {
    label: 'E2E003',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E003' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E003),
      validBetween,
    },
  },
  {
    label: 'E2E004',
    stopPlace: {
      name: { lang: 'fin', value: 'Albertinkatu 38' },
      quays: [{ publicCode: 'E2E004' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E004),
      validBetween,
    },
  },
  {
    label: 'E2E005',
    stopPlace: {
      name: { lang: 'fin', value: 'Lönnrotinkatu 32' },
      quays: [{ publicCode: 'E2E005' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E005),
      validBetween,
    },
  },
  {
    label: 'E2E006',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E006' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E006),
      validBetween,
    },
  },
  {
    label: 'E2E007',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 18' },
      quays: [{ publicCode: 'E2E007' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E007),
      validBetween,
    },
  },
  {
    label: 'E2E008',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E008' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E008),
      validBetween,
    },
  },
  {
    label: 'E2E009',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 15' },
      quays: [{ publicCode: 'E2E009' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E009),
      validBetween,
    },
  },
];

const baseStopRegistryData = {
  organisations: [],
  stopAreas: [],
  stopPlaces: stopPlaceData,
};

export const getClonedBaseStopRegistryData = () =>
  cloneDeepWith(baseStopRegistryData, (value) => {
    if (value instanceof DateTime) {
      return value;
    }

    return undefined;
  });
