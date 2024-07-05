import {
  StopRegistryInfoSpotInput,
  StopRegistryPosterPlaceSize,
  StopRegistryPosterPlaceType,
} from '../../generated/graphql';

export type InfoSpotInput = StopRegistryInfoSpotInput;

const mapToInfoSpotInput = (seedInfoSpot: InfoSpotInput): InfoSpotInput => {
  return seedInfoSpot;
};

const infoSpots: Array<InfoSpotInput> = [
  {
    backlight: true,
    description: 'Ensimmäinen kerros, portaiden vieressä',
    floor: '1',
    label: 'JP1234567',
    // maintenance: null, // Not clear whether this will be needed.
    posterPlaceSize: StopRegistryPosterPlaceSize.Cm80x120,
    posterPlaceType: StopRegistryPosterPlaceType.Static,
    displayType: null, // Only set if posterPlaceType = Dynamic
    speechProperty: null, // Only set if posterPlaceType = Dynamic
    purpose: 'Tiedotteet',
    railInformation: '7',
    zoneLabel: 'A',
    // TODO: poster
    // TODO: onStopPlace
  },
];

const seedData: Array<InfoSpotInput> = [...infoSpots];

export const seedInfoSpots: Array<InfoSpotInput> =
  seedData.map(mapToInfoSpotInput);
