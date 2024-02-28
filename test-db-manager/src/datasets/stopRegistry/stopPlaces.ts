import {
  StopRegistryInterchangeWeightingType,
  StopRegistryNameType,
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
          name: { lang: 'fin', value: seedStopPlace.abbreviationSwe5Char },
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
        },
      ],
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
    abbreviationFin5Char: 'Pohj.esplanadi',
    abbreviationSwe5Char: 'N.esplanaden',
    abbreviationFin: 'P.Esp',
    abbreviationSwe: 'N.Esp',
    locationFin: 'Pohjoisesplanadi (sij.)',
    locationSwe: 'Norraesplanaden (plats)',
    interchangeWeighting:
      StopRegistryInterchangeWeightingType.RecommendedInterchange,
  },
];
export const seedStopPlaces: Array<StopPlaceInput> =
  seedData.map(mapToStopPlaceInput);
