import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotInput,
  StopRegistryInfoSpotType,
  StopRegistryPosterPlaceSize,
} from '../../generated/graphql';

export type InfoSpotInput = {
  infoSpot: StopRegistryInfoSpotInput;
  locatedOnStopLabel?: string;
  associatedShelter?: number; // index of shelter
  locatedInTerminal?: string;
};

const mapToInfoSpotInput = (seedInfoSpot: InfoSpotInput): InfoSpotInput => {
  return seedInfoSpot;
};

const infoSpots: Array<InfoSpotInput> = [
  {
    infoSpot: {
      description: {
        lang: 'fi',
        value: 'Ensimmäinen kerros, portaiden vieressä',
      },
      floor: '1',
      label: 'JP1234568',
      maintenance: 'Huoltotietojen tekstit tähän...',
      infoSpotType: StopRegistryInfoSpotType.Static,
      purpose: 'Tiedotteet',
      railInformation: '7',
      zoneLabel: 'A',
      displayType: null, // Only set if posterPlaceType = Dynamic
      speechProperty: null, // Only set if posterPlaceType = Dynamic
      backlight: true, // Only set if posterPlaceType = Static
      posterPlaceSize: StopRegistryPosterPlaceSize.Cm80x120, // Only set if posterPlaceType = Static
      poster: [
        // Only set if posterPlaceType = Static
        {
          label: 'PT1234',
          posterSize: StopRegistryPosterPlaceSize.A4,
          lines: '1, 6, 17',
        },
      ],
    },
    locatedOnStopLabel: 'V1562',
    associatedShelter: 0,
  },
  {
    infoSpot: {
      description: {
        lang: 'fi',
        value: 'Ensimmäinen kerros, portaiden takana',
      },
      floor: '1',
      label: 'JP1234567',
      maintenance: 'Huoltotietojen tekstit tähän...',
      purpose: 'Dynaaminen näyttö',
      railInformation: '8',
      zoneLabel: 'B',
      infoSpotType: StopRegistryInfoSpotType.Dynamic,
      displayType: StopRegistryDisplayType.BatteryMultiRow, // Only set if posterPlaceType = Dynamic
      speechProperty: true, // Only set if posterPlaceType = Dynamic
      backlight: null, // Only set if posterPlaceType = Static
      posterPlaceSize: null, // Only set if posterPlaceType = Static
      poster: null, // Only set if posterPlaceType = Static
    },
    locatedOnStopLabel: 'V1562',
    associatedShelter: 1,
  },
  {
    infoSpot: {
      infoSpotType: StopRegistryInfoSpotType.SoundBeacon,
      description: {
        lang: 'fi',
        value: 'Tolpassa',
      },
      floor: '1',
      label: 'JP1234569',
      maintenance: 'Huoltotietojen tekstit tähän...',
      purpose: 'Äänimajakka',
      railInformation: '9',
      zoneLabel: 'C',
      displayType: null, // Only set if posterPlaceType = Dynamic
      speechProperty: null, // Only set if posterPlaceType = Dynamic
      backlight: null, // Only set if posterPlaceType = Static
      posterPlaceSize: null, // Only set if posterPlaceType = Static
      poster: null, // Only set if posterPlaceType = Static
    },
    locatedOnStopLabel: 'V1562',
    associatedShelter: 2,
  },
];

const seedData: Array<InfoSpotInput> = [...infoSpots];

export const seedInfoSpots: Array<InfoSpotInput> =
  seedData.map(mapToInfoSpotInput);
