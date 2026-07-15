import { StopRegistryIntendedUser } from '../../../../../../generated/graphql';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';
import { mapPurposeToString } from './infoSpotPurposeUtils';

// Default stop label format: [stopLabel]_[orderNumber], where orderNumber is infoSpotCount + 1.s
export function getInfoSpotLabel(stopLabel: string, infoSpotCount: number) {
  return `${stopLabel}_${infoSpotCount + 1}`;
}

export const defaultInfoSpotPosterValues = {
  label: mapPurposeToString({
    purposeType: InfoSpotPurposeEnum.POSTER,
    customPurpose: null,
  }),
  width: 800,
  height: 1200,
};

export const defaultInfoSpotValues = {
  intendedUser: StopRegistryIntendedUser.Matkatieto,
  width: 800,
  height: 1200,
  poster: [defaultInfoSpotPosterValues],
};
