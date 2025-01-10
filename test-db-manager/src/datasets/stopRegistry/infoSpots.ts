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

const infoSpotJP1234568: StopRegistryInfoSpotInput = {
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
};

const infoSpotJP1234567: StopRegistryInfoSpotInput = {
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
};

const infoSpotJP1234569: StopRegistryInfoSpotInput = {
  infoSpotType: StopRegistryInfoSpotType.SoundBeacon,
  description: {
    lang: 'fi',
    value: 'Tolpassa',
  },
  floor: '1',
  label: 'JP1234569',
  maintenance: 'Huoltotietojen tekstit tähän...',
  purpose: 'Infopaikan käyttötarkoitus',
  railInformation: '9',
  zoneLabel: 'C',
  displayType: null, // Only set if posterPlaceType = Dynamic
  speechProperty: null, // Only set if posterPlaceType = Dynamic
  backlight: null, // Only set if posterPlaceType = Static
  posterPlaceSize: null, // Only set if posterPlaceType = Static
  poster: null, // Only set if posterPlaceType = Static
};

const infoSpots: Array<InfoSpotInput> = [
  {
    infoSpot: infoSpotJP1234568,
    locatedOnStopLabel: 'V1562',
    associatedShelter: 0,
  },
  {
    infoSpot: infoSpotJP1234567,
    locatedOnStopLabel: 'V1562',
    associatedShelter: 1,
  },
  {
    infoSpot: infoSpotJP1234569,
    locatedOnStopLabel: 'V1562',
    associatedShelter: 2,
  },
  {
    // Reusing info same spot on another stop
    infoSpot: infoSpotJP1234568,
    locatedOnStopLabel: 'H2003',
    associatedShelter: 0,
  },
];

const seedData: Array<InfoSpotInput> = [...infoSpots];

export const seedInfoSpots: Array<InfoSpotInput> =
  seedData.map(mapToInfoSpotInput);
