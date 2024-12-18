import { DateTime } from 'luxon';
import {
  StopRegistryAccessibilityLevel,
  StopRegistryAccessibilityLimitationsInput,
  StopRegistryCycleStorageEquipmentInput,
  StopRegistryCycleStorageType,
  StopRegistryGeoJsonType,
  StopRegistryGuidanceType,
  StopRegistryHslAccessibilityProperties,
  StopRegistryLimitationStatusType,
  StopRegistryMapType,
  StopRegistryNameType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterEquipmentInput,
  StopRegistryShelterType,
  StopRegistryShelterWidthType,
  StopRegistrySignContentType,
  StopRegistryStopPlace,
  StopRegistryStopType,
  StopRegistryTransportModeType,
} from '../../generated/graphql';
import { getKeyValue } from './utils';

type OrganisationName = string;
export type StopPlaceMaintenance = {
  cleaning: OrganisationName | null;
  infoUpkeep: OrganisationName | null;
  maintenance: OrganisationName | null;
  owner: OrganisationName | null;
  winterMaintenance: OrganisationName | null;
};

export type StopPlaceQuaySeedData = {
  label: string;
  locationFin?: string;
  locationSwe?: string;
  validityStart?: string; // Really a datetime, but keyValues can only take strings.
  validityEnd?: string; // Really a datetime, but keyValues can only take strings.
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
  locationLat: number;
  locationLong: number;
  streetAddress?: string;
  postalCode?: string;
  functionalArea?: string; // Really more of a number, but keyValues can only take strings.
  priority?: string; // Really more of a number, but keyValues can only take strings.
  shelterEquipment?: Array<StopRegistryShelterEquipmentInput>;
  cycleStorageEquipment?: StopRegistryCycleStorageEquipmentInput;
  accessibilityProperties?: Partial<StopRegistryHslAccessibilityProperties>;
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

export const defaultAccessibilityLimitations: StopRegistryAccessibilityLimitationsInput =
  {
    audibleSignalsAvailable: StopRegistryLimitationStatusType.Unknown,
    escalatorFreeAccess: StopRegistryLimitationStatusType.Unknown,
    liftFreeAccess: StopRegistryLimitationStatusType.Unknown,
    stepFreeAccess: StopRegistryLimitationStatusType.Unknown,
    wheelchairAccess: StopRegistryLimitationStatusType.Unknown,
  };

export type StopPlaceNetexRef = {
  label: string;
  netexId: string;
  shelterRef: Array<string>;
};

export type StopPlaceInput = {
  label: string;
  maintenance?: StopPlaceMaintenance | null; // Actual maintenance relations will be populated based on these.
  stopPlace: Partial<StopRegistryStopPlace>;
};

const mapToStopPlaceInput = (
  seedStopPlace: StopPlaceQuaySeedData,
): StopPlaceInput => {
  return {
    label: seedStopPlace.label,
    stopPlace: {
      quays: [
        {
          publicCode: seedStopPlace.label,
          // TODO type error
          privateCode: seedStopPlace.publicCode,
          description: {
            lang: 'fin',
            value: seedStopPlace.locationFin,
          },
          alternativeNames: [
            seedStopPlace.locationSwe
              ? {
                  name: { lang: 'swe', value: seedStopPlace.locationSwe },
                  nameType: StopRegistryNameType.Other,
                }
              : null,
          ],

          // Location properties:
          // Note: Tiamat sets topographicPlace and fareZone automatically based on coordinates. They can not be changed otherwise.
          geometry:
            seedStopPlace.locationLat && seedStopPlace.locationLong
              ? {
                  coordinates: [
                    seedStopPlace.locationLong,
                    seedStopPlace.locationLat,
                  ],
                  type: StopRegistryGeoJsonType.Point,
                }
              : null,

          // Equipment properties:
          placeEquipments: {
            generalSign: seedStopPlace.signs && [
              {
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
            shelterEquipment:
              seedStopPlace.shelterEquipment && seedStopPlace.shelterEquipment,
            cycleStorageEquipment: seedStopPlace.cycleStorageEquipment && [
              seedStopPlace.cycleStorageEquipment,
            ],
          },

          // Accessibility properties:
          accessibilityAssessment:
            (seedStopPlace.accessibilityProperties ??
            seedStopPlace.accessibilityLimitations)
              ? {
                  hslAccessibilityProperties:
                    seedStopPlace.accessibilityProperties ?? null,
                  limitations: seedStopPlace.accessibilityLimitations && {
                    ...defaultAccessibilityLimitations,
                    ...seedStopPlace.accessibilityLimitations,
                  },
                }
              : undefined,

          keyValues: [
            getKeyValue('ELYCode', seedStopPlace.elyNumber),
            getKeyValue('streetAddress', seedStopPlace.streetAddress),
            getKeyValue('postalCode', seedStopPlace.postalCode),
            getKeyValue('functionalArea', seedStopPlace.functionalArea),
            getKeyValue('priority', seedStopPlace.priority),
            getKeyValue('validityStart', seedStopPlace.validityStart),
            getKeyValue('validityEnd', seedStopPlace.validityEnd),
          ],
        },
      ],
    },
  };
};
// Gets unnecessarily long and ugly with "prettier" so disabling it for these arrays.
// prettier-ignore
const route35Stops: Array<StopPlaceQuaySeedData> = [
  { label: 'H1376', locationLong: 24.885561, locationLat: 60.198389, locationSwe: 'Dragonvägen 8' },
  { label: 'H1377', locationLong: 24.87594,  locationLat: 60.205858, locationSwe: 'Munkshöjdens kyrka' },
  { label: 'H1398', locationLong: 24.88078,  locationLat: 60.20663,  locationSwe: 'Munkshöjden' }, // Lapinmäentie
  { label: 'H1416', locationLong: 24.879,    locationLat: 60.2055,   locationSwe: 'Munkshöjden' }, // Raumantie
  { label: 'H1451', locationLong: 24.883581, locationLat: 60.205589, locationSwe: 'Lognäsvägen' }, // Opposite of H1452
  { label: 'H1452', locationLong: 24.883556, locationLat: 60.205493, locationSwe: 'Lognäsvägen' }, // Opposite of H1451
  { label: 'H1453', locationLong: 24.884656, locationLat: 60.204225, locationSwe: 'Näshöjdsgränden' },
  { label: 'H1454', locationLong: 24.884535, locationLat: 60.203123, locationSwe: 'Näshöjden' },
  { label: 'H1455', locationLong: 24.88356,  locationLat: 60.203794, locationSwe: 'Näshöjdsvägen' },
  { label: 'H1456', locationLong: 24.884701, locationLat: 60.200373, locationSwe: 'Dragonvägen' }, // Rakuunantie 16
  { label: 'H1458', locationLong: 24.883186, locationLat: 60.200773, locationSwe: 'Dragonvägen' }, // Huopalahdentie
];

// A long route that spans multiple cities and fare zones.
// prettier-ignore
const route530Stops: Array<StopPlaceQuaySeedData> = [
  { label: "V1562", locationLong: 24.85559,  locationLat: 60.26118, locationSwe: 'Myrbacka station',
    shelterEquipment: [
      {
        enclosed: true,
        stepFree: false,
        shelterType: StopRegistryShelterType.Steel,
        shelterElectricity: StopRegistryShelterElectricity.Continuous,
        shelterLighting: true,
        shelterCondition: StopRegistryShelterCondition.Mediocre,
        timetableCabinets: 1,
        trashCan: true,
        shelterHasDisplay: true,
        bicycleParking: true,
        leaningRail: true,
        outsideBench: true,
        shelterFasciaBoardTaping: true,
        // There also exists `seats` field here, but we currently don't have plans for that in the UI so leaving it out.
      },
      {
        enclosed: true,
        stepFree: true,
        shelterType: StopRegistryShelterType.Glass,
        shelterElectricity: StopRegistryShelterElectricity.Continuous,
        shelterLighting: true,
        shelterCondition: StopRegistryShelterCondition.Good,
        timetableCabinets: 1,
        trashCan: true,
        shelterHasDisplay: false,
        bicycleParking: true,
        leaningRail: true,
        outsideBench: false,
        shelterFasciaBoardTaping: true,
        // There also exists `seats` field here, but we currently don't have plans for that in the UI so leaving it out.
      },
      {
        enclosed: false,
        stepFree: true,
        shelterType: StopRegistryShelterType.Post,
        shelterElectricity: StopRegistryShelterElectricity.Light,
        shelterLighting: true,
        shelterCondition: StopRegistryShelterCondition.Bad,
        timetableCabinets: 1,
        trashCan: false,
        shelterHasDisplay: false,
        bicycleParking: false,
        leaningRail: false,
        outsideBench: true,
        shelterFasciaBoardTaping: false,
        // There also exists `seats` field here, but we currently don't have plans for that in the UI so leaving it out.
      },
    ],
   },
  { label: "V1598", locationLong: 24.85224,  locationLat: 60.25926,   locationSwe: 'Stenflisvägen' },
  { label: "V1502", locationLong: 24.842287, locationLat: 60.259445,  locationSwe: 'Raappavuorentie' },
  { label: "V1310", locationLong: 24.83456,  locationLat: 60.25875,   locationSwe: 'Spånvägen' },
  { label: "V1308", locationLong: 24.82877,  locationLat: 60.25622,   locationSwe: 'Friherrsstigen' },
  { label: "V1201", locationLong: 24.81982,  locationLat: 60.25397,   locationSwe: 'Repgränden' },
  { label: "V1203", locationLong: 24.81418,  locationLat: 60.25461,   locationSwe: 'Björkbergagränden' },
  { label: "V1205", locationLong: 24.80591,  locationLat: 60.25572,   locationSwe: 'Mandelgränden' },
  { label: "V1291", locationLong: 24.79965,  locationLat: 60.25508,   locationSwe: 'Ollonvägen' },
  { label: "V1009", locationLong: 24.7786,   locationLat: 60.25467,   locationSwe: 'Linnaisvägen' },
  { label: "E1438", locationLong: 24.772509, locationLat: 60.253188,  locationSwe: 'Jupperrondellen' },
  { label: "E1434", locationLong: 24.76301,  locationLat: 60.25041,   locationSwe: 'Villabacken' },
  { label: "E1423", locationLong: 24.74724,  locationLat: 60.24338,   locationSwe: 'Kututräskvägen' },
  { label: "E1430", locationLong: 24.738327, locationLat: 60.240036,  locationSwe: 'Källstrandskorset' },
  { label: "E1539", locationLong: 24.722068, locationLat: 60.23536,   locationSwe: 'Villnäs' },
  { label: "E1534", locationLong: 24.716022, locationLat: 60.231825,  locationSwe: 'Auroran koulu' },
  { label: "E1530", locationLong: 24.709818, locationLat: 60.228014,  locationSwe: 'Klappstranden' },
  { label: "E1524", locationLong: 24.705575, locationLat: 60.224182,  locationSwe: 'Petas' },
  { label: "E6301", locationLong: 24.687416, locationLat: 60.223379,  locationSwe: 'Jorv' },
  { label: "E6312", locationLong: 24.669556, locationLat: 60.221276,  locationSwe: 'Fallåker' },
  { label: "E6309", locationLong: 24.661122, locationLat: 60.218001,  locationSwe: 'Ikea Esbo' },
  { label: "E6032", locationLong: 24.65783,  locationLat: 60.21543,   locationSwe: 'Gloms' },
  { label: "E6002", locationLong: 24.65328,  locationLat: 60.2131,    locationSwe: 'Lövkulla' },
  { label: "E6020", locationLong: 24.66041,  locationLat: 60.20801,   locationSwe: 'Brunnsmästargatan' },
  { label: "E6008", locationLong: 24.658466, locationLat: 60.206091,  locationSwe: 'Esbo station' },
  { label: "E6170", locationLong: 24.65257,  locationLat: 60.2023,    locationSwe: 'Samaria' },
  { label: "E6016", locationLong: 24.6548,   locationLat: 60.19896,   locationSwe: 'Gillesberget' },
  { label: "E6172", locationLong: 24.663459, locationLat: 60.195213,  locationSwe: 'Lugnet' },
  { label: "E4328", locationLong: 24.67732,  locationLat: 60.17993,   locationSwe: 'Kuckubacka' },
  { label: "E4329", locationLong: 24.689947, locationLat: 60.172966,  locationSwe: 'Bolarskogsgatan' },
  { label: "E4905", locationLong: 24.702882, locationLat: 60.164212,  locationSwe: 'Ängsbrinken' },
  { label: "E4464", locationLong: 24.706945, locationLat: 60.157696,  locationSwe: 'Finnogården' },
  { label: "E4461", locationLong: 24.709598, locationLat: 60.154934,  locationSwe: 'Finno (M)' },
  { label: "E3142", locationLong: 24.72747,  locationLat: 60.15706,   locationSwe: 'Fiskelyckan' },
];

const H2003: StopPlaceQuaySeedData = {
  label: 'H2003',
  publicCode: '10003',
  elyNumber: '1234567',
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
  shelterEquipment: [
    {
      enclosed: true,
      stepFree: false,
      shelterType: StopRegistryShelterType.Steel,
      shelterElectricity: StopRegistryShelterElectricity.Continuous,
      shelterLighting: true,
      shelterCondition: StopRegistryShelterCondition.Mediocre,
      timetableCabinets: 1,
      trashCan: true,
      shelterHasDisplay: true,
      bicycleParking: true,
      leaningRail: true,
      outsideBench: true,
      shelterFasciaBoardTaping: true,
      // There also exists `seats` field here, but we currently don't have plans for that in the UI so leaving it out.
    },
  ],
  cycleStorageEquipment: {
    cycleStorageType: StopRegistryCycleStorageType.Other,
    // There also exists `numberOfSpaces` field here, but we currently don't have plans for that in the UI so leaving it out.
  },
  accessibilityProperties: {
    stopAreaSideSlope: 5.3,
    stopAreaLengthwiseSlope: 1.8,
    endRampSlope: 3.5,
    shelterLaneDistance: 123,
    curbBackOfRailDistance: 45.6,
    curbDriveSideOfRailDistance: 5,
    structureLaneDistance: 6,
    stopElevationFromRailTop: 10,
    stopElevationFromSidewalk: 7,
    lowerCleatHeight: 8,
    serviceAreaWidth: 4.6,
    serviceAreaLength: 55.2,
    platformEdgeWarningArea: true,
    guidanceTiles: true,
    guidanceStripe: true,
    serviceAreaStripes: true,
    sidewalkAccessibleConnection: true,
    stopAreaSurroundingsAccessible: false,
    curvedStop: false,
    stopType: StopRegistryStopType.PullOut,
    shelterType: StopRegistryShelterWidthType.Wide,
    guidanceType: StopRegistryGuidanceType.Braille,
    mapType: StopRegistryMapType.Tactile,
    pedestrianCrossingRampType: StopRegistryPedestrianCrossingRampType.Lr,
    accessibilityLevel: StopRegistryAccessibilityLevel.Inaccessible,
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
const seedData: Array<StopPlaceQuaySeedData> = [
  ...route35Stops,
  ...route530Stops,
  H2003,
];

export const seedStopPlaces: Array<StopPlaceInput> =
  seedData.map(mapToStopPlaceInput);
export const stopPlaceH2003 = mapToStopPlaceInput(H2003);
export const stopPlaceV1562 = mapToStopPlaceInput(route530Stops[0]);
