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
  interchangeWeighting?: StopRegistryInterchangeWeightingType;
  stopState?: string /* See StopPlaceState */;
  locationLat?: number;
  locationLong?: number;
  postalCode?: string;
  generalSign?: string;
  shelterEquipment?: StopRegistryShelterEquipmentInput;
  cycleStorageEquipment?: StopRegistryCycleStorageEquipmentInput;
  accessibilityLimitations?: Partial<StopRegistryAccessibilityLimitationsInput>;
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
      weighting: seedStopPlace.interchangeWeighting, // For "vaihtopysäkki"
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
        seedStopPlace.postalCode && {
          key: 'postalCode',
          values: [seedStopPlace.postalCode],
        },
        seedStopPlace.stopState && {
          key: 'state',
          values: [seedStopPlace.stopState],
        },
      ],
      // TODO: Pysäkin osoite
      // TODO: toiminnalinen alue

      // Equipment properties:
      placeEquipments: {
        generalSign: seedStopPlace.generalSign && [
          {
            // Note: this could have "content" as well.
            privateCode: { type: 'HSL', value: seedStopPlace.generalSign }, // TODO: the values still need further specification.
            signContentType: StopRegistrySignContentType.TransportMode,
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

const seedData: Array<StopPlaceSeedData> = [
  // Stops for route 35:
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
  // Other stops
  {
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
    interchangeWeighting:
      StopRegistryInterchangeWeightingType.RecommendedInterchange,
    stopState: 'OutOfOperation',
    // TODO: the coordinates should come from routes DB really.
    locationLat: 60.180413,
    locationLong: 24.92799,
    postalCode: '00100',
    generalSign: 'Tolppamerkki',
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
  },
];
export const seedStopPlaces: Array<StopPlaceInput> =
  seedData.map(mapToStopPlaceInput);
