import {
  StopRegistryNameType,
  StopRegistryStopPlace,
} from '../../generated/graphql';

export type StopPlaceSeedData = {
  label: string;
  nameFi: string;
  nameSV: string;
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
      name: { lang: 'fi_FI', value: seedStopPlace.nameFi },
      alternativeNames: [
        {
          name: { lang: 'sv_FI', value: seedStopPlace.nameSV },
          nameType: StopRegistryNameType.Translation,
        },
      ],
    },
  };
};

export const seedStopPlaces: Array<StopPlaceInput> = [
  // Stops for route 35:
  { label: 'H1376', nameFi: 'Rakuunantie 8', nameSV: 'Dragonvägen 8' },
  {
    label: 'H1377',
    nameFi: 'Munkkivuoren kirkko',
    nameSV: 'Munkshöjdens kyrka',
  },
  { label: 'H1398', nameFi: 'Munkkivuori', nameSV: 'Munkshöjden' }, // Lapinmäentie
  { label: 'H1416', nameFi: 'Munkkivuori', nameSV: 'Munkshöjden' }, // Raumantie
  { label: 'H1451', nameFi: 'Luuvaniementie', nameSV: 'Lognäsvägen' }, // Opposite of H1452
  { label: 'H1452', nameFi: 'Luuvaniementie', nameSV: 'Lognäsvägen' }, // Opposite of H1451
  { label: 'H1453', nameFi: 'Niemenmäenkuja', nameSV: 'Näshöjdsgränden' },
  { label: 'H1454', nameFi: 'Niemenmäki', nameSV: 'Näshöjden' },
  { label: 'H1455', nameFi: 'Niemenmäentie', nameSV: 'Näshöjdsvägen' },
  { label: 'H1456', nameFi: 'Rakuunantie', nameSV: 'Dragonvägen' }, // Rakuunantie 16
  { label: 'H1458', nameFi: 'Rakuunantie', nameSV: 'Dragonvägen' }, // Huopalahdentie
].map(mapToStopPlaceInput);
