import {
  StopRegistryAccessibilityLimitationsInput,
  StopRegistryCreateMultiModalStopPlaceInput,
  StopRegistryGeoJsonType,
  StopRegistryGuidanceType,
  StopRegistryHslAccessibilityProperties,
  StopRegistryLimitationStatusType,
  StopRegistryMapType,
  StopRegistryParentStopPlaceInput,
} from '../../generated/graphql';
import { mapToAlternativeNames } from './mapAlternativeNames';
import { defaultAccessibilityLimitations } from './stopPlaces';
import { getKeyValue } from './utils';

export type TerminalSeedData = {
  privateCode: string;
  name: string;
  nameSwe?: string;
  nameEng?: string;
  nameFinLong?: string;
  nameSweLong?: string;
  nameEngLong?: string;
  abbreviationFin?: string;
  abbreviationSwe?: string;
  abbreviationEng?: string;
  description: string;
  locationLat: number;
  locationLong: number;
  validityStart?: string;
  validityEnd?: string;
  streetAddress?: string;
  postalCode?: string;
  municipality?: string;
  fareZone?: string;
  departurePlatforms?: string;
  arrivalPlatforms?: string;
  loadingPlatforms?: string;
  electricCharging?: string;
  terminalType?: string;
  accessibilityProperties?: Partial<StopRegistryHslAccessibilityProperties>;
  accessibilityLimitations?: Partial<StopRegistryAccessibilityLimitationsInput>;
  members: Array<string>;
};

export type TerminalInput = {
  memberLabels: Array<string>;
  // Only some details can be inserted with the Create mutation. Others must be Updated afterwards.
  terminal: Omit<StopRegistryCreateMultiModalStopPlaceInput, 'stopPlaceIds'> &
    Partial<StopRegistryParentStopPlaceInput>;
};

const mapToTerminalInput = (seedTerminal: TerminalSeedData): TerminalInput => {
  return {
    memberLabels: seedTerminal.members,
    terminal: {
      name: {
        lang: 'fin',
        value: seedTerminal.name,
      },
      alternativeNames: mapToAlternativeNames(seedTerminal),
      description: {
        lang: 'fin',
        value: seedTerminal.description,
      },
      geometry: {
        coordinates: [seedTerminal.locationLong, seedTerminal.locationLat],
        type: StopRegistryGeoJsonType.Point,
      },
      privateCode: {
        value: seedTerminal.privateCode,
      },
      keyValues: [
        getKeyValue('streetAddress', seedTerminal.streetAddress),
        getKeyValue('postalCode', seedTerminal.postalCode),
        getKeyValue('municipality', seedTerminal.municipality),
        getKeyValue('fareZone', seedTerminal.fareZone),
        getKeyValue('departurePlatforms', seedTerminal.departurePlatforms),
        getKeyValue('arrivalPlatforms', seedTerminal.arrivalPlatforms),
        getKeyValue('loadingPlatforms', seedTerminal.loadingPlatforms),
        getKeyValue('electricCharging', seedTerminal.electricCharging),
        getKeyValue('terminalType', seedTerminal.terminalType),
        getKeyValue('validityStart', seedTerminal.validityStart),
        getKeyValue('validityEnd', seedTerminal.validityEnd),
      ],

      // Accessibility properties:
      accessibilityAssessment:
        (seedTerminal.accessibilityProperties ??
        seedTerminal.accessibilityLimitations)
          ? {
              hslAccessibilityProperties:
                seedTerminal.accessibilityProperties ?? null,
              limitations: seedTerminal.accessibilityLimitations && {
                ...defaultAccessibilityLimitations,
                ...seedTerminal.accessibilityLimitations,
              },
            }
          : undefined,
    },
  };
};

const northEsplanadi = {
  name: 'Pohjoisesplanadi Terminaali',
  nameSwe: 'Norraesplanaden',
  nameFinLong: 'Pohjosesplanadi',
  nameSweLong: 'Norraesplanaden',
  abbreviationFin: 'P.Espl.',
  abbreviationSwe: 'N.Espl.',
  description: 'Terminaali Pohjoisesplanadilla',
  privateCode: 'T1',
  locationLat: 60.167836,
  locationLong: 24.94905,
  members: ['X1234'],
  validityStart: '2020-01-01',
  validityEnd: '2050-01-01',
  streetAddress: 'Mannerheimintie 22-24',
  postalCode: '00100',
  municipality: 'Helsinki',
  fareZone: 'A',
  departurePlatforms: '7',
  arrivalPlatforms: '6  ',
  loadingPlatforms: '3',
  electricCharging: '2',
  terminalType: 'Bussiterminaali',
  accessibilityLimitations: {
    audibleSignalsAvailable: StopRegistryLimitationStatusType.True,
  },
  accessibilityProperties: {
    guidanceType: StopRegistryGuidanceType.Braille,
    mapType: StopRegistryMapType.Tactile,
  },
};

const pasila = {
  name: 'Pasila',
  nameSwe: 'Böle',
  nameFinLong: 'Pasilan terminaali',
  nameSweLong: 'Böle terminal',
  abbreviationFin: 'PA.',
  abbreviationSwe: 'BÖ.',
  description: 'Terminaali joka sijaitsee Pasilassa',
  privateCode: 'PA',
  locationLat: 60.167836,
  locationLong: 24.94905,
  members: ['110548', '110699'],
  validityStart: '2020-01-01',
  validityEnd: '2050-01-01',
  streetAddress: 'Pasilansilta 5',
  postalCode: '00520',
  municipality: 'Helsinki',
  fareZone: 'A',
  departurePlatforms: '7',
  arrivalPlatforms: '6  ',
  loadingPlatforms: '3',
  electricCharging: '2',
  terminalType: 'Bussiterminaali',
  accessibilityLimitations: {
    audibleSignalsAvailable: StopRegistryLimitationStatusType.True,
  },
  accessibilityProperties: {
    guidanceType: StopRegistryGuidanceType.Braille,
    mapType: StopRegistryMapType.Tactile,
  },
};

const seedData: Array<TerminalSeedData> = [northEsplanadi];

export const seedTerminals: Array<TerminalInput> =
  seedData.map(mapToTerminalInput);

const localSeedData: Array<TerminalSeedData> = [pasila];

export const seedLocalTerminals: Array<TerminalInput> =
  localSeedData.map(mapToTerminalInput);
