import { StopRegistryIntendedUser } from '../../../../../../generated/graphql';
import { InfoSpotPurposeEnum } from '../types/InfoSpotPurpose';
import { mapPurposeToString } from './infoSpotPurposeUtils';

export function getInfoSpotLabel(stopLabel: string, infoSpotCount: number) {
  // We want the default label to be [Stop ID]_[Order number], so use infoSpotCount + 1
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
