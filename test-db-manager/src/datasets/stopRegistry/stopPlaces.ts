import {
  StopRegistryNameType,
  StopRegistryStopPlace,
} from '../../generated/graphql';

export type StopPlaceSeedData = {
  label: string;
  nameFin: string;
  nameSwe: string;
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
      ],
    },
  };
};

export const seedStopPlaces: Array<StopPlaceInput> = [
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
].map(mapToStopPlaceInput);
