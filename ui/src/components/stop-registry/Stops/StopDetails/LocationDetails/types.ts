import { StopRegistrySignContentType } from '../../../../../generated/graphql';

// Filtered enum containing only the signContentTypes that should be available
// in the location details form.
export const LocationSignContentType = {
  TransportModePoint: StopRegistrySignContentType.TransportModePoint,
  Other: StopRegistrySignContentType.Other,
};
