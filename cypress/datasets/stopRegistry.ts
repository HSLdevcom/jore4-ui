import {
  StopPlaceInput,
  StopRegistryGeoJson,
  StopRegistryGeoJsonType,
  StopRegistryNameType,
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
      privateCode: { value: 'E2E001', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Annankatu 15'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E001),
    },
  },
  {
    label: 'E2E002',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E002' }],
      privateCode: { value: 'E2E002', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Annankatu 20'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E002),
    },
  },
  {
    label: 'E2E003',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E003' }],
      privateCode: { value: 'E2E003', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Kalevankatu 32'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E003),
    },
  },
  {
    label: 'E2E004',
    stopPlace: {
      name: { lang: 'fin', value: 'Albertinkatu 38' },
      alternativeNames: [
        {
          nameType: StopRegistryNameType.Translation,
          name: { lang: 'swe', value: 'Albertsgatan 38' },
        },
        {
          nameType: StopRegistryNameType.Alias,
          name: { lang: 'swe', value: 'Albertsgatan 38 (lång)' },
        },
        {
          nameType: StopRegistryNameType.Alias,
          name: { lang: 'swe', value: 'Albertinkatu 38 (pitkä)' },
        },
      ],
      quays: [{ publicCode: 'E2E004' }],
      privateCode: { value: 'E2E004', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Albertinkatu 38'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E004),
    },
  },
  {
    label: 'E2E005',
    stopPlace: {
      name: { lang: 'fin', value: 'Lönnrotinkatu 32' },
      quays: [{ publicCode: 'E2E005' }],
      privateCode: { value: 'E2E005', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Lönnrotinkatu 32'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E005),
    },
  },
  {
    label: 'E2E006',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      quays: [{ publicCode: 'E2E006' }],
      privateCode: { value: 'E2E006', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Kalevankatu 32'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E006),
    },
  },
  {
    label: 'E2E007',
    stopPlace: {
      name: { lang: 'fin', value: 'Kalevankatu 18' },
      quays: [{ publicCode: 'E2E007' }],
      privateCode: { value: 'E2E007', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Kalevankatu 18'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E007),
    },
  },
  {
    label: 'E2E008',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 20' },
      quays: [{ publicCode: 'E2E008' }],
      privateCode: { value: 'E2E008', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Annankatu 20'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E008),
    },
  },
  {
    label: 'E2E009',
    stopPlace: {
      name: { lang: 'fin', value: 'Annankatu 15' },
      quays: [{ publicCode: 'E2E009' }],
      privateCode: { value: 'E2E009', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Annankatu 15'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E009),
    },
  },
  {
    label: 'E2E010',
    stopPlace: {
      name: { lang: 'fin', value: 'Finnoonkartano' },
      quays: [{ publicCode: 'E2E010' }],
      privateCode: { value: 'E2E010', type: 'ELY' },
      keyValues: [{ key: 'streetAddress', values: ['Finnoonkartano'] }],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E010),
    },
  },
];

const baseStopRegistryData = {
  organisations: [],
  stopAreas: [],
  stopPlaces: stopPlaceData,
};

export const getClonedBaseStopRegistryData = () =>
  cloneDeep(baseStopRegistryData);
