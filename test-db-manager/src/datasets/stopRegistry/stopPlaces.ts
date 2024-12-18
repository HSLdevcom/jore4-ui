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
  validityStart?: DateTime;
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
  maintenance?: StopPlaceMaintenance;
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
  seedStopPlace: StopPlaceSeedData,
): StopPlaceInput => {
  return {
    label: seedStopPlace.label,
    maintenance: seedStopPlace.maintenance ?? null,
    stopPlace: {
      quays: [
        {
          publicCode: seedStopPlace.publicCode,
          privateCode: seedStopPlace.elyNumber
            ? {
                value: seedStopPlace.elyNumber,
                type: 'ELY',
              }
            : null,
          description: {
            lang: 'fin',
            value: seedStopPlace.locationFin,
          },
          alternativeNames: [
            seedStopPlace.abbreviationFin
              ? {
                  name: { lang: 'fin', value: seedStopPlace.abbreviationFin },
                  nameType: StopRegistryNameType.Alias,
                }
              : null,
            seedStopPlace.abbreviationSwe
              ? {
                  name: { lang: 'swe', value: seedStopPlace.abbreviationSwe },
                  nameType: StopRegistryNameType.Alias,
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
                privateCode: {
                  type: 'HSL',
                  value: seedStopPlace.signs.signType,
                },
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
            getKeyValue('streetAddress', seedStopPlace.streetAddress),
            getKeyValue('postalCode', seedStopPlace.postalCode),
            getKeyValue('functionalArea', seedStopPlace.functionalArea),
            getKeyValue('stopState', seedStopPlace.stopState),
            getKeyValue('virtual', seedStopPlace.stopType?.virtual),
            getKeyValue('mainLine', seedStopPlace.stopType?.mainLine),
          ],
        },
      ],
    },
  };
};
// Gets unnecessarily long and ugly with "prettier" so disabling it for these arrays.
// prettier-ignore
const route35Stops: Array<StopPlaceSeedData> = [
  { label: 'H1376', locationLong: 24.885561, locationLat: 60.198389, nameFin: 'Rakuunantie 8',       nameSwe: 'Dragonvägen 8' },
  { label: 'H1377', locationLong: 24.87594,  locationLat: 60.205858, nameFin: 'Munkkivuoren kirkko', nameSwe: 'Munkshöjdens kyrka' },
  { label: 'H1398', locationLong: 24.88078,  locationLat: 60.20663,  nameFin: 'Munkkivuori',         nameSwe: 'Munkshöjden' }, // Lapinmäentie
  { label: 'H1416', locationLong: 24.879,    locationLat: 60.2055,   nameFin: 'Munkkivuori',         nameSwe: 'Munkshöjden' }, // Raumantie
  { label: 'H1451', locationLong: 24.883581, locationLat: 60.205589, nameFin: 'Luuvaniementie',      nameSwe: 'Lognäsvägen' }, // Opposite of H1452
  { label: 'H1452', locationLong: 24.883556, locationLat: 60.205493, nameFin: 'Luuvaniementie',      nameSwe: 'Lognäsvägen' }, // Opposite of H1451
  { label: 'H1453', locationLong: 24.884656, locationLat: 60.204225, nameFin: 'Niemenmäenkuja',      nameSwe: 'Näshöjdsgränden' },
  { label: 'H1454', locationLong: 24.884535, locationLat: 60.203123, nameFin: 'Niemenmäki',          nameSwe: 'Näshöjden' },
  { label: 'H1455', locationLong: 24.88356,  locationLat: 60.203794, nameFin: 'Niemenmäentie',       nameSwe: 'Näshöjdsvägen' },
  { label: 'H1456', locationLong: 24.884701, locationLat: 60.200373, nameFin: 'Rakuunantie',         nameSwe: 'Dragonvägen' }, // Rakuunantie 16
  { label: 'H1458', locationLong: 24.883186, locationLat: 60.200773, nameFin: 'Rakuunantie',         nameSwe: 'Dragonvägen' }, // Huopalahdentie
];

// A long route that spans multiple cities and fare zones.
// prettier-ignore
const route530Stops: Array<StopPlaceSeedData> = [
  { label: "V1562", locationLong: 24.85559,  locationLat: 60.26118,   nameFin: 'Myyrmäen asema',    nameSwe: 'Myrbacka station',
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
  { label: "V1598", locationLong: 24.85224,  locationLat: 60.25926,   nameFin: 'Iskostie',          nameSwe: 'Stenflisvägen' },
  { label: "V1502", locationLong: 24.842287, locationLat: 60.259445,  nameFin: 'Raappavuorentie',   nameSwe: 'Raappavuorentie' },
  { label: "V1310", locationLong: 24.83456,  locationLat: 60.25875,   nameFin: 'Lastutie',          nameSwe: 'Spånvägen' },
  { label: "V1308", locationLong: 24.82877,  locationLat: 60.25622,   nameFin: 'Vapaalanpolku',     nameSwe: 'Friherrsstigen' },
  { label: "V1201", locationLong: 24.81982,  locationLat: 60.25397,   nameFin: 'Köysikuja',         nameSwe: 'Repgränden' },
  { label: "V1203", locationLong: 24.81418,  locationLat: 60.25461,   nameFin: 'Koivuvaarankuja',   nameSwe: 'Björkbergagränden' },
  { label: "V1205", locationLong: 24.80591,  locationLat: 60.25572,   nameFin: 'Mantelikuja',       nameSwe: 'Mandelgränden' },
  { label: "V1291", locationLong: 24.79965,  locationLat: 60.25508,   nameFin: 'Terhotie',          nameSwe: 'Ollonvägen' },
  { label: "V1009", locationLong: 24.7786,   locationLat: 60.25467,   nameFin: 'Linnaistentie',     nameSwe: 'Linnaisvägen' },
  { label: "E1438", locationLong: 24.772509, locationLat: 60.253188,  nameFin: 'Jupperinympyrä',    nameSwe: 'Jupperrondellen' },
  { label: "E1434", locationLong: 24.76301,  locationLat: 60.25041,   nameFin: 'Huvilamäki',        nameSwe: 'Villabacken' },
  { label: "E1423", locationLong: 24.74724,  locationLat: 60.24338,   nameFin: 'Kuttulammentie',    nameSwe: 'Kututräskvägen' },
  { label: "E1430", locationLong: 24.738327, locationLat: 60.240036,  nameFin: 'Lähderannanristi',  nameSwe: 'Källstrandskorset' },
  { label: "E1539", locationLong: 24.722068, locationLat: 60.23536,   nameFin: 'Vilniemi',          nameSwe: 'Villnäs' },
  { label: "E1534", locationLong: 24.716022, locationLat: 60.231825,  nameFin: 'Auroran koulu',     nameSwe: 'Auroran koulu' },
  { label: "E1530", locationLong: 24.709818, locationLat: 60.228014,  nameFin: 'Kolkeranta',        nameSwe: 'Klappstranden' },
  { label: "E1524", locationLong: 24.705575, locationLat: 60.224182,  nameFin: 'Petas',             nameSwe: 'Petas' },
  { label: "E6301", locationLong: 24.687416, locationLat: 60.223379,  nameFin: 'Jorvi',             nameSwe: 'Jorv' },
  { label: "E6312", locationLong: 24.669556, locationLat: 60.221276,  nameFin: 'Fallåker',          nameSwe: 'Fallåker' },
  { label: "E6309", locationLong: 24.661122, locationLat: 60.218001,  nameFin: 'Ikea Espoo',        nameSwe: 'Ikea Esbo' },
  { label: "E6032", locationLong: 24.65783,  locationLat: 60.21543,   nameFin: 'Lommila',           nameSwe: 'Gloms' },
  { label: "E6002", locationLong: 24.65328,  locationLat: 60.2131,    nameFin: 'Lehtimäki',         nameSwe: 'Lövkulla' },
  { label: "E6020", locationLong: 24.66041,  locationLat: 60.20801,   nameFin: 'Kaivomestarinkatu', nameSwe: 'Brunnsmästargatan' },
  { label: "E6008", locationLong: 24.658466, locationLat: 60.206091,  nameFin: 'Espoon asema',      nameSwe: 'Esbo station' },
  { label: "E6170", locationLong: 24.65257,  locationLat: 60.2023,    nameFin: 'Samaria',           nameSwe: 'Samaria' },
  { label: "E6016", locationLong: 24.6548,   locationLat: 60.19896,   nameFin: 'Kiltakallio',       nameSwe: 'Gillesberget' },
  { label: "E6172", locationLong: 24.663459, locationLat: 60.195213,  nameFin: 'Lugnet',            nameSwe: 'Lugnet' },
  { label: "E4328", locationLong: 24.67732,  locationLat: 60.17993,   nameFin: 'Kukkumäki',         nameSwe: 'Kuckubacka' },
  { label: "E4329", locationLong: 24.689947, locationLat: 60.172966,  nameFin: 'Puolarmetsänkatu',  nameSwe: 'Bolarskogsgatan' },
  { label: "E4905", locationLong: 24.702882, locationLat: 60.164212,  nameFin: 'Niittyrinne',       nameSwe: 'Ängsbrinken' },
  { label: "E4464", locationLong: 24.706945, locationLat: 60.157696,  nameFin: 'Finnoonkartano',    nameSwe: 'Finnogården' },
  { label: "E4461", locationLong: 24.709598, locationLat: 60.154934,  nameFin: 'Finnoo (M)',        nameSwe: 'Finno (M)' },
  { label: "E3142", locationLong: 24.72747,  locationLat: 60.15706,   nameFin: 'Kalaonni',          nameSwe: 'Fiskelyckan' },
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
  maintenance: {
    cleaning: 'Clear Channel',
    infoUpkeep: null,
    maintenance: 'ELY-keskus',
    owner: 'JCD',
    winterMaintenance: 'ELY-keskus',
  },
};
const seedData: Array<StopPlaceSeedData> = [
  ...route35Stops,
  ...route530Stops,
  H2003,
];

export const seedStopPlaces: Array<StopPlaceInput> =
  seedData.map(mapToStopPlaceInput);
export const stopPlaceH2003 = mapToStopPlaceInput(H2003);
export const stopPlaceV1562 = mapToStopPlaceInput(route530Stops[0]);
