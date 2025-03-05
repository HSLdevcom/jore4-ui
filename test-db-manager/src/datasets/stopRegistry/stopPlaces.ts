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
  StopRegistryQuayInput,
  StopRegistryShelterCondition,
  StopRegistryShelterElectricity,
  StopRegistryShelterEquipmentInput,
  StopRegistryShelterType,
  StopRegistryShelterWidthType,
  StopRegistrySignContentType,
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
  stopArea?: string;
  locationFin?: string;
  locationSwe?: string;
  validityStart?: string; // Really a datetime, but keyValues can only take strings.
  validityEnd?: string; // Really a datetime, but keyValues can only take strings.
  transportMode?: StopRegistryTransportModeType;
  publicCode: string;
  privateCode: string;
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
  quayRef: Array<QuayNetexRef>;
};

export type QuayNetexRef = {
  label: string;
  netexId: string;
  shelterRef: Array<string>;
};

export type QuayInput = {
  stopArea?: string;
  quay: Partial<StopRegistryQuayInput>;
};

const mapToQuayInput = (seedStopPlace: StopPlaceQuaySeedData): QuayInput => {
  return {
    stopArea: seedStopPlace.stopArea,
    quay: {
      publicCode: seedStopPlace.publicCode,
      privateCode: { type: 'HSL', value: seedStopPlace.privateCode },
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
            privateCode: {
              type: 'HSL',
              value: seedStopPlace.signs.signType,
            },
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
      accessibilityAssessment: (seedStopPlace.accessibilityProperties ??
        seedStopPlace.accessibilityLimitations) && {
        hslAccessibilityProperties:
          seedStopPlace.accessibilityProperties ?? null,
        limitations: seedStopPlace.accessibilityLimitations && {
          ...defaultAccessibilityLimitations,
          ...seedStopPlace.accessibilityLimitations,
        },
      },

      keyValues: [
        getKeyValue('elyNumber', seedStopPlace.elyNumber),
        getKeyValue('streetAddress', seedStopPlace.streetAddress),
        getKeyValue('postalCode', seedStopPlace.postalCode),
        getKeyValue('functionalArea', seedStopPlace.functionalArea),
        getKeyValue('stopState', seedStopPlace.stopState),
        getKeyValue('mainLine', seedStopPlace.stopType?.mainLine),
        getKeyValue('interchange', seedStopPlace.stopType?.interchange),
        getKeyValue('railReplacement', seedStopPlace.stopType?.railReplacement),
        getKeyValue('virtual', seedStopPlace.stopType?.virtual),
        getKeyValue('priority', seedStopPlace.priority),
        getKeyValue('validityStart', seedStopPlace.validityStart),
        getKeyValue('validityEnd', seedStopPlace.validityEnd),
      ],
    },
  };
};
// Gets unnecessarily long and ugly with "prettier" so disabling it for these arrays.
// prettier-ignore
const route35Stops: Array<StopPlaceQuaySeedData> = [
  { publicCode: 'H1376', privateCode: "111110", locationLong: 24.885561, locationLat: 60.198389, locationFin: 'Raakunantie 8', locationSwe: 'Dragonvägen 8', stopArea: 'X1302' },
  { publicCode: 'H1377', privateCode: "111111", locationLong: 24.87594,  locationLat: 60.205858, locationFin: 'Munkkivuoren kirkko',locationSwe: 'Munkshöjdens kyrka', stopArea: 'X1302' },
  { publicCode: 'H1398', privateCode: "111112", locationLong: 24.88078,  locationLat: 60.20663,  locationFin: 'Lapinmäentie 1',locationSwe: 'Labbackavägen 1' }, // Lapinmäentie
  { publicCode: 'H1416', privateCode: "111113", locationLong: 24.879,    locationLat: 60.2055,   locationFin: 'Raumantie 1',locationSwe: 'Raumovägen 1' }, // Raumantie
  { publicCode: 'H1451', privateCode: "111114", locationLong: 24.883581, locationLat: 60.205589, locationFin: 'Niemenmäentie 9',locationSwe: 'Näshöjdasvägen 9' }, // Opposite of H1452
  { publicCode: 'H1452', privateCode: "111115", locationLong: 24.883556, locationLat: 60.205493, locationFin: 'Niemenmäentie 8',locationSwe: 'Näshöjdasvägen 8' }, // Opposite of H1451
  { publicCode: 'H1453', privateCode: "111116", locationLong: 24.884656, locationLat: 60.204225, locationFin: 'Niemenmäenkuja 1',locationSwe: 'Näshöjdsgränden 1' },
  { publicCode: 'H1454', privateCode: "111117", locationLong: 24.884535, locationLat: 60.203123, locationFin: 'Luuvaniementie 5',locationSwe: 'Lognasvägen 5' },
  { publicCode: 'H1455', privateCode: "111118", locationLong: 24.88356,  locationLat: 60.203794, locationFin: 'Luuvaniementie 3',locationSwe: 'Lognasvägen 3' },
  { publicCode: 'H1456', privateCode: "111119", locationLong: 24.884701, locationLat: 60.200373, locationFin: 'Rakuunantie 16',locationSwe: 'Dragonvägen' }, // Rakuunantie 16
  { publicCode: 'H1458', privateCode: "111120", locationLong: 24.883186, locationLat: 60.200773, locationFin: 'Huopalahdentie 15',locationSwe: 'Hoplaksvägen 15' }, // Huopalahdentie
];

// A long route that spans multiple cities and fare zones.
// prettier-ignore
const route530Stops: Array<StopPlaceQuaySeedData> = [
  { publicCode: "V1562", privateCode: "111111", locationLong: 24.85559,  locationLat: 60.26118, locationSwe: 'Myrbacka station',
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
  { publicCode: "V1598", privateCode: '999910', locationLong: 24.85224,  locationLat: 60.25926,   locationSwe: 'Stenflisvägen' },
  { publicCode: "V1502", privateCode: '999911', locationLong: 24.842287, locationLat: 60.259445,  locationSwe: 'Raappavuorentie' },
  { publicCode: "V1310", privateCode: '999912', locationLong: 24.83456,  locationLat: 60.25875,   locationSwe: 'Spånvägen' },
  { publicCode: "V1308", privateCode: '999913', locationLong: 24.82877,  locationLat: 60.25622,   locationSwe: 'Friherrsstigen' },
  { publicCode: "V1201", privateCode: '999914', locationLong: 24.81982,  locationLat: 60.25397,   locationSwe: 'Repgränden' },
  { publicCode: "V1203", privateCode: '999915', locationLong: 24.81418,  locationLat: 60.25461,   locationSwe: 'Björkbergagränden' },
  { publicCode: "V1205", privateCode: '999916', locationLong: 24.80591,  locationLat: 60.25572,   locationSwe: 'Mandelgränden' },
  { publicCode: "V1291", privateCode: '999917', locationLong: 24.79965,  locationLat: 60.25508,   locationSwe: 'Ollonvägen' },
  { publicCode: "V1009", privateCode: '999918', locationLong: 24.7786,   locationLat: 60.25467,   locationSwe: 'Linnaisvägen' },
  { publicCode: "E1438", privateCode: '999919', locationLong: 24.772509, locationLat: 60.253188,  locationSwe: 'Jupperrondellen' },
  { publicCode: "E1434", privateCode: '999920', locationLong: 24.76301,  locationLat: 60.25041,   locationSwe: 'Villabacken' },
  { publicCode: "E1423", privateCode: '999921', locationLong: 24.74724,  locationLat: 60.24338,   locationSwe: 'Kututräskvägen' },
  { publicCode: "E1430", privateCode: '999922', locationLong: 24.738327, locationLat: 60.240036,  locationSwe: 'Källstrandskorset' },
  { publicCode: "E1539", privateCode: '999923', locationLong: 24.722068, locationLat: 60.23536,   locationSwe: 'Villnäs' },
  { publicCode: "E1534", privateCode: '999924', locationLong: 24.716022, locationLat: 60.231825,  locationSwe: 'Auroran koulu' },
  { publicCode: "E1530", privateCode: '999925', locationLong: 24.709818, locationLat: 60.228014,  locationSwe: 'Klappstranden' },
  { publicCode: "E1524", privateCode: '999926', locationLong: 24.705575, locationLat: 60.224182,  locationSwe: 'Petas' },
  { publicCode: "E6301", privateCode: '999927', locationLong: 24.687416, locationLat: 60.223379,  locationSwe: 'Jorv' },
  { publicCode: "E6312", privateCode: '999928', locationLong: 24.669556, locationLat: 60.221276,  locationSwe: 'Fallåker' },
  { publicCode: "E6309", privateCode: '999929', locationLong: 24.661122, locationLat: 60.218001,  locationSwe: 'Ikea Esbo' },
  { publicCode: "E6032", privateCode: '999930', locationLong: 24.65783,  locationLat: 60.21543,   locationSwe: 'Gloms' },
  { publicCode: "E6002", privateCode: '999931', locationLong: 24.65328,  locationLat: 60.2131,    locationSwe: 'Lövkulla' },
  { publicCode: "E6020", privateCode: '999932', locationLong: 24.66041,  locationLat: 60.20801,   locationSwe: 'Brunnsmästargatan' },
  { publicCode: "E6008", privateCode: '999933', locationLong: 24.658466, locationLat: 60.206091,  locationSwe: 'Esbo station' },
  { publicCode: "E6170", privateCode: '999934', locationLong: 24.65257,  locationLat: 60.2023,    locationSwe: 'Samaria' },
  { publicCode: "E6016", privateCode: '999935', locationLong: 24.6548,   locationLat: 60.19896,   locationSwe: 'Gillesberget' },
  { publicCode: "E6172", privateCode: '999936', locationLong: 24.663459, locationLat: 60.195213,  locationSwe: 'Lugnet' },
  { publicCode: "E4328", privateCode: '999937', locationLong: 24.67732,  locationLat: 60.17993,   locationSwe: 'Kuckubacka' },
  { publicCode: "E4329", privateCode: '999938', locationLong: 24.689947, locationLat: 60.172966,  locationSwe: 'Bolarskogsgatan' },
  { publicCode: "E4905", privateCode: '999939', locationLong: 24.702882, locationLat: 60.164212,  locationSwe: 'Ängsbrinken' },
  { publicCode: "E4464", privateCode: '999940', locationLong: 24.706945, locationLat: 60.157696,  locationSwe: 'Finnogården' },
  { publicCode: "E4461", privateCode: '999941', locationLong: 24.709598, locationLat: 60.154934,  locationSwe: 'Finno (M)' },
  { publicCode: "E3142", privateCode: '999942', locationLong: 24.72747,  locationLat: 60.15706,   locationSwe: 'Fiskelyckan' },
];

const H2003: StopPlaceQuaySeedData = {
  stopArea: 'X1234',
  publicCode: 'H2003',
  privateCode: '10003',
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

export const seedQuays: Array<QuayInput> = seedData.map(mapToQuayInput);
export const quayH2003 = mapToQuayInput(H2003);
export const quayV1562 = mapToQuayInput(route530Stops[0]);
