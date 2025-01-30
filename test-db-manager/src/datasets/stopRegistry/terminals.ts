import { DateTime } from 'luxon';
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
import { defaultAccessibilityLimitations } from './stopPlaces';
import { getKeyValue } from './utils';

export type TerminalSeedData = {
  label: string;
  name: string;
  description: string;
  locationLat: number;
  locationLong: number;
  validityStart?: DateTime;
  streetAddress?: string;
  postalCode?: string;
  departurePlatforms?: string;
  arrivalPlatforms?: string;
  loadingPlatforms?: string;
  electricCharging?: string;
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
      description: {
        lang: 'fin',
        value: seedTerminal.description,
      },
      /*
      validBetween: {
        fromDate:
          seedTerminal.validityStart ??
          DateTime.fromISO('2026-01-01T00:00:00.001'),
        toDate: null,
      },
      */
      geometry: {
        coordinates: [seedTerminal.locationLong, seedTerminal.locationLat],
        type: StopRegistryGeoJsonType.Point,
      },
      privateCode: {
        value: seedTerminal.label,
      },
      keyValues: [
        getKeyValue('streetAddress', seedTerminal.streetAddress),
        getKeyValue('postalCode', seedTerminal.postalCode),
        getKeyValue('departurePlatforms', seedTerminal.departurePlatforms),
        getKeyValue('arrivalPlatforms', seedTerminal.arrivalPlatforms),
        getKeyValue('loadingPlatforms', seedTerminal.loadingPlatforms),
        getKeyValue('electricCharging', seedTerminal.electricCharging),
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
  description: 'Terminaali Pohjoisesplanadilla',
  label: 'T1',
  locationLat: 60.167836,
  locationLong: 24.94905,
  members: ['X1234'],
  streetAddress: 'Mannerheimintie 22-24',
  postalCode: '00100',
  departurePlatforms: '7',
  arrivalPlatforms: '6  ',
  loadingPlatforms: '3',
  electricCharging: '2',
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
