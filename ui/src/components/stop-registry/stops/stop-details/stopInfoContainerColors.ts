import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';
import { InfoContainerColors } from '../../../common/InfoContainer';

export const stopInfoContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslNeutralBlue,
  borderColor: theme.colors.border.hslBlue,
};

export const inactiveInfoContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.grey,
  borderColor: theme.colors.lightGrey,
  textColorClassName: 'text-white',
};

const busContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.tweakedBrand,
  borderColor: theme.colors.border.hslBlue,
  textColorClassName: 'text-white',
};

const trunkLineContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslTrunkLineOrange,
  borderColor: theme.colors.border.hslMetroOrange,
  textColorClassName: 'text-white',
};

const tramContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslTramDarkGreen,
  borderColor: theme.colors.border.hslTramGreen,
  textColorClassName: 'text-white',
};

const speedTramContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslSpeedTramTurquoise,
  borderColor: theme.colors.border.hslSpeedTramTurquoise,
  textColorClassName: 'text-white',
};

const metroContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslMetroOrange,
  borderColor: theme.colors.border.hslMetroOrange,
  textColorClassName: 'text-white',
};

const railContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslTrainPurple,
  borderColor: theme.colors.border.hslCommuterTrainPurple,
  textColorClassName: 'text-white',
};

const ferryContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslFerryBlue,
  borderColor: theme.colors.border.hslFerryBlue,
  textColorClassName: 'text-white',
};

export function getContainerColorsByTransportMode(
  mode: StopRegistryTransportModeType | undefined | null,
  trunkLineStop: boolean | undefined | null = false,
  speedTramStop: boolean | undefined | null = false,
): InfoContainerColors {
  switch (mode) {
    case StopRegistryTransportModeType.Bus:
      return trunkLineStop ? trunkLineContainerColors : busContainerColors;

    case StopRegistryTransportModeType.Metro:
      return metroContainerColors;

    case StopRegistryTransportModeType.Rail:
      return railContainerColors;

    case StopRegistryTransportModeType.Tram:
      return speedTramStop ? speedTramContainerColors : tramContainerColors;

    case StopRegistryTransportModeType.Water:
      return ferryContainerColors;

    default:
      return stopInfoContainerColors;
  }
}
