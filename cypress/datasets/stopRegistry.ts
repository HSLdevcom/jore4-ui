import {
  StopPlaceInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonType,
} from '@hsl/jore4-test-db-manager';
import cloneDeep from 'lodash/cloneDeep';
import { stopCoordinatesByLabel } from './base';

const coordinatesToStopRegistryGeoJSON = (
  coordinates: number[],
): StopRegistryGeoJson => {
  return {
    coordinates: coordinates.slice(0, 2),
    type: StopRegistryGeoJsonType.Point,
  };
};

// Stop registry stopPlace data for each scheduled stop point in the base dataset.
const stopPlaceData: Array<StopPlaceInput> = [
  {
    label: 'E2E001',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 15' },
      quays: [{ publicCode: 'E2E001' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E001),
    },
  },
  {
    label: 'E2E002',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E002' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E002),
    },
  },
  {
    label: 'E2E003',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E003' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E003),
    },
  },
  {
    label: 'E2E004',
    stopPlace: {
      name: { lang: 'fin', value: 'Albertinkatu 38' },
      quays: [{ publicCode: 'E2E004' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E004),
    },
  },
  {
    label: 'E2E005',
    stopPlace: {
      name: { lang: 'fin', value: 'Lönnrotinkatu 32' },
      quays: [{ publicCode: 'E2E005' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E005),
    },
  },
  {
    label: 'E2E006',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E006' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E006),
    },
  },
  {
    label: 'E2E007',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 18' },
      quays: [{ publicCode: 'E2E007' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E007),
    },
  },
  {
    label: 'E2E008',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E008' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E008),
    },
  },
  {
    label: 'E2E009',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 15' },
      quays: [{ publicCode: 'E2E009' }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E009),
    },
  },
];

const baseStopRegistryData = {
  organisations: [],
  stopAreas: [],
  stopPlaces: stopPlaceData,
};

export const getCLonedBaseStopRegistryData = () =>
  cloneDeep(baseStopRegistryData);
