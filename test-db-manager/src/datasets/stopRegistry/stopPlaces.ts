import {
  StopRegistryAccessibilityLimitationsInput,
  StopRegistryCycleStorageEquipmentInput,
  StopRegistryCycleStorageType,
  StopRegistryGeoJsonType,
  StopRegistryInterchangeWeightingType,
  StopRegistryLimitationStatusType,
  StopRegistryNameType,
  StopRegistryShelterEquipmentInput,
  StopRegistrySignContentType,
  StopRegistryStopPlace,
  StopRegistrySubmodeType,
  StopRegistryTransportModeType,
} from '../../generated/graphql';

export type StopPlaceSeedData = {
  label: string;
  nameFin: string;
  nameSwe: string;
  nameFinLong?: string;
  nameSweLong?: string;
  abbreviationFin?: string;
  abbreviationSwe?: string;
  abbreviationFin5Char?: string;
  abbreviationSwe5Char?: string;
  locationFin?: string;
  locationSwe?: string;
  transportMode?: StopRegistryTransportModeType;
  publicCode?: string;
  elyNumber?: string;
  stopState?: string /* See StopPlaceState */;
  stopType?: {
    mainLine: boolean;
    interchange: boolean;
    railReplacement: boolean;
    virtual: boolean;
  };
  locationLat?: number;
  locationLong?: number;
  streetAddress?: string;
  postalCode?: string;
  functionalArea?: string; // Really more of a number, but keyValues can only take strings.
  shelterEquipment?: StopRegistryShelterEquipmentInput;
  cycleStorageEquipment?: StopRegistryCycleStorageEquipmentInput;
  accessibilityLimitations?: Partial<StopRegistryAccessibilityLimitationsInput>;
  signs?: {
    signType: string /* see StopPlaceSignType */;
    note?: string;
    numberOfFrames: number;
    lineSignage: boolean;
    mainLineSign: boolean;
    replacesRailSign: boolean;
  };
};

const defaultAccessibilityLimitations: StopRegistryAccessibilityLimitationsInput =
  {
    audibleSignalsAvailable: StopRegistryLimitationStatusType.Unknown,
    escalatorFreeAccess: StopRegistryLimitationStatusType.Unknown,
    liftFreeAccess: StopRegistryLimitationStatusType.Unknown,
    stepFreeAccess: StopRegistryLimitationStatusType.Unknown,
    wheelchairAccess: StopRegistryLimitationStatusType.Unknown,
  };

export type StopPlaceInput = {
  label: string;
  stopPlace: Partial<StopRegistryStopPlace>;
};

const mapToStopPlaceInput = (
  seedStopPlace: StopPlaceSeedData,
): StopPlaceInput => {
  return {
    label: seedStopPlace.label,
    stopPlace: {
      name: { lang: 'fin', value: seedStopPlace.nameFin },
      alternativeNames: [
        {
          name: { lang: 'swe', value: seedStopPlace.nameSwe },
          nameType: StopRegistryNameType.Translation,
        },
        seedStopPlace.abbreviationFin5Char && {
          name: { lang: 'fin', value: seedStopPlace.abbreviationFin5Char },
          nameType: StopRegistryNameType.Label,
        },
        seedStopPlace.abbreviationSwe5Char && {
          name: { lang: 'swe', value: seedStopPlace.abbreviationSwe5Char },
          nameType: StopRegistryNameType.Label,
        },
        seedStopPlace.nameFinLong && {
          name: { lang: 'fin', value: seedStopPlace.nameFinLong },
          nameType: StopRegistryNameType.Alias,
        },
        seedStopPlace.nameSweLong && {
          name: { lang: 'swe', value: seedStopPlace.nameSweLong },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: seedStopPlace.locationSwe },
          nameType: StopRegistryNameType.Other,
        },
      ],
      transportMode:
        seedStopPlace.transportMode || StopRegistryTransportModeType.Bus,
      publicCode: seedStopPlace.publicCode,
      privateCode: seedStopPlace.elyNumber && {
        value: seedStopPlace.elyNumber,
        type: 'ELY',
      },
      description: {
        lang: 'fin',
        value: seedStopPlace.locationFin,
      },
      weighting:
        (seedStopPlace.stopType?.interchange &&
          StopRegistryInterchangeWeightingType.RecommendedInterchange) ||
        undefined,
      submode:
        (seedStopPlace.stopType?.railReplacement &&
          StopRegistrySubmodeType.RailReplacementBus) ||
        undefined,
      quays: [
        {
          publicCode: seedStopPlace.label,
          alternativeNames: [
            seedStopPlace.abbreviationFin && {
              name: { lang: 'fin', value: seedStopPlace.abbreviationFin },
              nameType: StopRegistryNameType.Alias,
            },
            seedStopPlace.abbreviationSwe && {
              name: { lang: 'swe', value: seedStopPlace.abbreviationSwe },
              nameType: StopRegistryNameType.Alias,
            },
          ],

          // Equipment properties:
          placeEquipments: {
            shelterEquipment: seedStopPlace.shelterEquipment && [
              seedStopPlace.shelterEquipment,
            ],
            cycleStorageEquipment: seedStopPlace.cycleStorageEquipment && [
              seedStopPlace.cycleStorageEquipment,
            ],
          },
        },
      ],

      // Location properties:
      geometry: seedStopPlace.locationLat &&
        seedStopPlace.locationLong && {
          coordinates: [
            [seedStopPlace.locationLat, seedStopPlace.locationLong],
          ],
          type: StopRegistryGeoJsonType.Point,
        },
      // TODO: topographicPlace. These can't be inserted through StopPlace GraphQL.
      // TODO: these require more specification and probably need to be inserted separately somehow.
      // tariffZones: [{ /* 'A' */ }],
      keyValues: [
        seedStopPlace.streetAddress && {
          key: 'streetAddress',
          values: [seedStopPlace.streetAddress],
        },
        seedStopPlace.postalCode && {
          key: 'postalCode',
          values: [seedStopPlace.postalCode],
        },
        seedStopPlace.functionalArea && {
          key: 'functionalArea',
          values: [seedStopPlace.functionalArea],
        },
        seedStopPlace.stopState && {
          key: 'stopState',
          values: [seedStopPlace.stopState],
        },
        seedStopPlace.stopType && {
          key: 'mainLine',
          values: [seedStopPlace.stopType.mainLine.toString()],
        },
        seedStopPlace.stopType && {
          key: 'virtual',
          values: [seedStopPlace.stopType.virtual.toString()],
        },
      ],

      // Equipment properties:
      placeEquipments: {
        generalSign: seedStopPlace.signs && [
          {
            privateCode: { type: 'HSL', value: seedStopPlace.signs.signType },
            signContentType: StopRegistrySignContentType.TransportMode,
            numberOfFrames: seedStopPlace.signs.numberOfFrames,
            lineSignage: seedStopPlace.signs.lineSignage,
            mainLineSign: seedStopPlace.signs.mainLineSign,
            replacesRailSign: seedStopPlace.signs.replacesRailSign,
            ...(seedStopPlace.signs.note
              ? {
                  note: {
                    lang: 'fin',
                    value: seedStopPlace.signs.note,
                  },
                }
              : {}),
          },
        ],
      },

      // Accessibility properties:
      accessibilityAssessment: seedStopPlace.accessibilityLimitations && {
        limitations: {
          ...defaultAccessibilityLimitations,
          ...seedStopPlace.accessibilityLimitations,
        },
      },
    },
  };
};

const route35Stops: Array<StopPlaceSeedData> = [
  { label: 'H1376', nameFin: 'Rakuunantie 8', nameSwe: 'Dragonvägen 8' },
  {
    label: 'H1377',
    nameFin: 'Munkkivuoren kirkko',
    nameSwe: 'Munkshöjdens kyrka',
  },
  { label: 'H1398', nameFin: 'Munkkivuori', nameSwe: 'Munkshöjden' }, // Lapinmäentie
  { label: 'H1416', nameFin: 'Munkkivuori', nameSwe: 'Munkshöjden' }, // Raumantie
  { label: 'H1451', nameFin: 'Luuvaniementie', nameSwe: 'Lognäsvägen' }, // Opposite of H1452
  { label: 'H1452', nameFin: 'Luuvaniementie', nameSwe: 'Lognäsvägen' }, // Opposite of H1451
  { label: 'H1453', nameFin: 'Niemenmäenkuja', nameSwe: 'Näshöjdsgränden' },
  { label: 'H1454', nameFin: 'Niemenmäki', nameSwe: 'Näshöjden' },
  { label: 'H1455', nameFin: 'Niemenmäentie', nameSwe: 'Näshöjdsvägen' },
  { label: 'H1456', nameFin: 'Rakuunantie', nameSwe: 'Dragonvägen' }, // Rakuunantie 16
  { label: 'H1458', nameFin: 'Rakuunantie', nameSwe: 'Dragonvägen' }, // Huopalahdentie
];
const H2003: StopPlaceSeedData = {
  label: 'H2003',
  publicCode: '10003',
  elyNumber: '1234567',
  nameFin: 'Pohjoisesplanadi',
  nameSwe: 'Norraesplanaden',
  nameFinLong: 'Pohjoisesplanadi (pitkä)',
  nameSweLong: 'Norraesplanaden (lång)',
  abbreviationFin5Char: 'P.Esp',
  abbreviationSwe5Char: 'N.Esp',
  abbreviationFin: 'Pohj.esplanadi',
  abbreviationSwe: 'N.esplanaden',
  locationFin: 'Pohjoisesplanadi (sij.)',
  locationSwe: 'Norraesplanaden (plats)',
  stopState: 'OutOfOperation',
  stopType: {
    mainLine: true,
    interchange: true,
    railReplacement: false,
    virtual: false,
  },
  // TODO: the coordinates should come from routes DB really.
  locationLat: 60.180413,
  locationLong: 24.92799,
  streetAddress: 'Mannerheimintie 22-24',
  postalCode: '00100',
  functionalArea: '20',
  shelterEquipment: {
    enclosed: true,
    stepFree: false,
    // There also exists `seats` field here, but we currently don't have plans for that in the UI so leaving it out.
  },
  cycleStorageEquipment: {
    cycleStorageType: StopRegistryCycleStorageType.Other,
    // There also exists `numberOfSpaces` field here, but we currently don't have plans for that in the UI so leaving it out.
  },
  accessibilityLimitations: {
    wheelchairAccess: StopRegistryLimitationStatusType.Partial,
  },
  signs: {
    signType: 'PoleSign',
    note: 'Ohjetekstiä...',
    numberOfFrames: 12,
    lineSignage: true,
    mainLineSign: false,
    replacesRailSign: false,
  },
};
const seedData: Array<StopPlaceSeedData> = [...route35Stops, H2003];

export const seedStopPlaces: Array<StopPlaceInput> =
  seedData.map(mapToStopPlaceInput);
export const stopPlaceH2003 = mapToStopPlaceInput(H2003).stopPlace;
