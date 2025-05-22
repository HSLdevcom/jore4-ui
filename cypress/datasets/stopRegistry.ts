import {
  Maybe,
  StopAreaInput,
  StopRegistryAlternativeName,
  StopRegistryEmbeddableMultilingualString,
  StopRegistryGeoJsonInput,
  StopRegistryGeoJsonType,
  StopRegistryNameType,
  TerminalInput,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import cloneDeep from 'lodash/cloneDeep';
import { stopCoordinatesByLabel } from './base';

const coordinatesToStopRegistryGeoJSON = (
  coordinates: number[],
): StopRegistryGeoJsonInput => {
  return {
    coordinates: coordinates.slice(0, 2),
    type: StopRegistryGeoJsonType.Point,
  };
};

export const Annankatu20Name: StopRegistryEmbeddableMultilingualString = {
  lang: 'fin',
  value: 'Annankatu 20',
};

// prettier-ignore
export const Annankatu20AltNames: Array<Maybe<StopRegistryAlternativeName>> = [
  { nameType: StopRegistryNameType.Translation, name: { lang: 'swe', value: 'Annasgatan 20' }, },
  { nameType: StopRegistryNameType.Other,       name: { lang: 'fin', value: 'Annankatu 20' } },
  { nameType: StopRegistryNameType.Other,       name: { lang: 'swe', value: 'Annasgatan 20' } },
  { nameType: StopRegistryNameType.Alias,       name: { lang: 'fin', value: 'Annankatu 20 pitkänimi' } },
  { nameType: StopRegistryNameType.Alias,       name: { lang: 'swe', value: 'Annasgatan 20 långnamn' } },
];

// prettier-ignore
export const Annankatu15AltNames: Array<Maybe<StopRegistryAlternativeName>> = [
  { nameType: StopRegistryNameType.Translation, name: { lang: 'swe', value: 'Annasgatan 15' }, },
  { nameType: StopRegistryNameType.Translation, name: { lang: 'eng', value: 'Annas street 15' }, },
  { nameType: StopRegistryNameType.Other,       name: { lang: 'fin', value: 'Annankatu 15' } },
  { nameType: StopRegistryNameType.Other,       name: { lang: 'swe', value: 'Annasgatan 15' } },
  { nameType: StopRegistryNameType.Other,       name: { lang: 'eng', value: 'Annas street 15' } },
  { nameType: StopRegistryNameType.Alias,       name: { lang: 'fin', value: 'Annankatu 15 pitkänimi' } },
  { nameType: StopRegistryNameType.Alias,       name: { lang: 'swe', value: 'Annasgatan 15 långnamn' } },
  { nameType: StopRegistryNameType.Alias,       name: { lang: 'eng', value: 'Annas street 15 long name' } },
];

export const Annankatu20Location: Array<Maybe<StopRegistryAlternativeName>> = [
  {
    nameType: StopRegistryNameType.Other,
    name: { lang: 'swe', value: 'Plats Annasgatan 20' },
  },
];

// Stop registry stopPlace data for each scheduled stop point in the base dataset.
const stopPlaceData: Array<StopAreaInput> = [
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'X0003' },
      name: { lang: 'fin', value: 'Annankatu 15' },
      alternativeNames: Annankatu15AltNames,
      keyValues: [
        { key: 'validityStart', values: ['2020-01-01'] },
        { key: 'validityEnd', values: ['2050-01-01'] },
      ],
      geometry: {
        coordinates: [24.938927, 60.165433],
        type: StopRegistryGeoJsonType.Point,
      },
      quays: [
        {
          publicCode: 'E2E001',
          description: { lang: 'fin', value: 'Annankatu 15' },
          keyValues: [
            { key: 'streetAddress', values: ['Annankatu 15'] },
            { key: 'elyNumber', values: ['E2E001'] },
          ],
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E001,
          ),
        },
        {
          publicCode: 'E2E009',
          description: { lang: 'fin', value: 'Annankatu 15' },
          keyValues: [
            { key: 'streetAddress', values: ['Annankatu 15'] },
            { key: 'elyNumber', values: ['E2E009'] },
          ],
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E009,
          ),
        },
      ],
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'X0004' },
      name: { lang: 'fin', value: 'Kalevankatu 32' },
      keyValues: [
        { key: 'validityStart', values: ['2020-01-01'] },
        { key: 'validityEnd', values: ['2050-01-01'] },
      ],
      geometry: {
        coordinates: [24.932914978884, 60.165538996581],
        type: StopRegistryGeoJsonType.Point,
      },
      quays: [
        {
          publicCode: 'E2E003',
          keyValues: [
            { key: 'streetAddress', values: ['Kalevankatu 32'] },
            { key: 'elyNumber', values: ['E2E003'] },
          ],
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E003,
          ),
        },
        {
          publicCode: 'E2E006',
          keyValues: [
            { key: 'streetAddress', values: ['Kalevankatu 32'] },
            { key: 'elyNumber', values: ['E2E006'] },
          ],
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E006,
          ),
        },
      ],
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E002' },
      name: Annankatu20Name,
      alternativeNames: Annankatu20AltNames,
      quays: [
        {
          publicCode: 'E2E002',
          alternativeNames: Annankatu20Location,
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E002,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Annankatu 20'] },
            { key: 'elyNumber', values: ['E2E002'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E002),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E004' },
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
          name: { lang: 'fin', value: 'Albertinkatu 38 (pitkä)' },
        },
      ],
      quays: [
        {
          publicCode: 'E2E004',
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E004,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Albertinkatu 38'] },
            { key: 'elyNumber', values: ['E2E004'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E004),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E005' },
      name: { lang: 'fin', value: 'Lönnrotinkatu 32' },
      quays: [
        {
          publicCode: 'E2E005',
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E005,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Lönnrotinkatu 32'] },
            { key: 'elyNumber', values: ['E2E005'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E005),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E007' },
      name: { lang: 'fin', value: 'Kalevankatu 18' },
      quays: [
        {
          publicCode: 'E2E007',
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E005,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Kalevankatu 18'] },
            { key: 'elyNumber', values: ['E2E007'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E007),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E008' },
      name: { lang: 'fin', value: 'Kuttulammentie' },
      quays: [
        {
          publicCode: 'E2E008',
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E005,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Kuttulammentie 15'] },
            { key: 'elyNumber', values: ['E2E008'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E008),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2E010' },
      name: { lang: 'fin', value: 'Finnoonkartano' },
      quays: [
        {
          publicCode: 'E2E010',
          geometry: coordinatesToStopRegistryGeoJSON(
            stopCoordinatesByLabel.E2E005,
          ),
          keyValues: [
            { key: 'streetAddress', values: ['Finnoonkartano'] },
            { key: 'elyNumber', values: ['E2E010'] },
          ],
        },
      ],
      geometry: coordinatesToStopRegistryGeoJSON(stopCoordinatesByLabel.E2E010),
    },
    organisations: null,
  },
  {
    StopArea: {
      privateCode: { type: 'HSL/TEST', value: 'E2ENQ' },
      name: { lang: 'fin', value: 'No quays' },
      quays: [],
      geometry: {
        coordinates: [60.16993494912799, 24.92596546020357],
        type: StopRegistryGeoJsonType.Point,
      },
    },
    organisations: null,
  },
];

// Stop registry terminal data.
const terminalData: Array<TerminalInput> = [
  {
    terminal: {
      privateCode: { type: 'HSL/TEST', value: 'T2' },
      name: { lang: 'fin', value: 'E2ET001' },
      description: { lang: 'fin', value: 'E2E testiterminaali' },
      alternativeNames: [
        {
          nameType: StopRegistryNameType.Translation,
          name: { lang: 'swe', value: 'Terminalen' },
        },
        {
          nameType: StopRegistryNameType.Translation,
          name: { lang: 'eng', value: 'Terminal' },
        },
        {
          nameType: StopRegistryNameType.Other,
          name: { lang: 'fin', value: 'Terminaali' },
        },
        {
          nameType: StopRegistryNameType.Other,
          name: { lang: 'swe', value: 'Terminalen' },
        },
        {
          nameType: StopRegistryNameType.Other,
          name: { lang: 'eng', value: 'Terminal' },
        },
        {
          nameType: StopRegistryNameType.Alias,
          name: { lang: 'fin', value: 'Terminaali pitkänimi' },
        },
        {
          nameType: StopRegistryNameType.Alias,
          name: { lang: 'swe', value: 'Terminalen långnamn' },
        },
        {
          nameType: StopRegistryNameType.Alias,
          name: { lang: 'eng', value: 'Terminal long name' },
        },
      ],
      geometry: {
        coordinates: [60.16993494912799, 24.92596546020357],
        type: StopRegistryGeoJsonType.Point,
      },
      keyValues: [
        { key: 'validityStart', values: ['2020-01-01'] },
        { key: 'validityEnd', values: ['2050-01-01'] },
        { key: 'streetAddress', values: ['Mannerheimintie 22-24'] },
        { key: 'postalCode', values: ['00100'] },
        { key: 'municipality', values: ['Helsinki'] },
        { key: 'fareZone', values: ['A'] },
        { key: 'departurePlatforms', values: ['7'] },
        { key: 'arrivalPlatforms', values: ['6'] },
        { key: 'loadingPlatforms', values: ['3'] },
        { key: 'electricCharging', values: ['2'] },
      ],
    },
    memberLabels: ['E2E008'],
  },
];

const baseStopRegistryData = {
  organisations: [],
  stopPlaces: stopPlaceData,
  terminals: terminalData,
};

export const getClonedBaseStopRegistryData = () =>
  cloneDeep(baseStopRegistryData);
