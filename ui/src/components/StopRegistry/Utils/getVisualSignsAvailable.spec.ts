import {
  StopRegistryGuidanceType,
  StopRegistryLimitationStatusType,
} from '../../../generated/graphql';
import { getVisualSignsAvailable } from './getVisualSignsAvailable';

describe('getVisualSignsAvailable', () => {
  it.each([
    undefined,
    null,
    {},
    { guidanceType: StopRegistryGuidanceType.None },
    { guidanceType: '' },
    { guidanceStripe: false, guidanceTiles: false },
    { guidanceType: null, guidanceStripe: null, guidanceTiles: null },
  ])('returns false without guidance: %j', (properties) => {
    expect(getVisualSignsAvailable(undefined, properties)).toBe(
      StopRegistryLimitationStatusType.False,
    );
  });

  it.each([
    { guidanceType: StopRegistryGuidanceType.Braille },
    { guidanceType: StopRegistryGuidanceType.Other },
    { guidanceStripe: true },
    { guidanceTiles: true },
    { guidanceType: StopRegistryGuidanceType.None, guidanceTiles: true },
  ])('returns true with guidance: %j', (properties) => {
    expect(getVisualSignsAvailable(null, properties)).toBe(
      StopRegistryLimitationStatusType.True,
    );
  });

  it.each([
    StopRegistryLimitationStatusType.True,
    StopRegistryLimitationStatusType.False,
    StopRegistryLimitationStatusType.Partial,
    StopRegistryLimitationStatusType.Unknown,
  ])('preserves the explicit status %s regardless of guidance', (status) => {
    expect(getVisualSignsAvailable(status, {})).toBe(status);
    expect(getVisualSignsAvailable(status, { guidanceTiles: true })).toBe(
      status,
    );
  });
});
