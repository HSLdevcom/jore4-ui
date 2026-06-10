import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';
import { InfoContainerColors } from '../../../common';

export const stopInfoContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.hslNeutralBlue,
  borderColor: theme.colors.border.hslBlue,
};

export const inactiveInfoContainerColors: InfoContainerColors = {
  backgroundColor: theme.colors.grey,
  borderColor: theme.colors.lightGrey,
  textColorClassName: 'text-white',
};

export function getContainerColorsByTransportMode(
  mode: StopRegistryTransportModeType | null | undefined,
): InfoContainerColors {
  switch (mode) {
    case StopRegistryTransportModeType.Tram:
      return {
        backgroundColor: theme.colors.hslTramDarkGreen,
        borderColor: theme.colors.border.hslTramGreen,
        textColorClassName: 'text-white',
      };
    default:
      return {
        backgroundColor: theme.colors.tweakedBrand,
        borderColor: theme.colors.border.hslBlue,
        textColorClassName: 'text-white',
      };
  }
}
