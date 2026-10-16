import {
  StopRegistryGuidanceType,
  StopRegistryLimitationStatusType,
} from '../../../generated/graphql';

type GuidanceProperties = {
  readonly guidanceType?: string | null;
  readonly guidanceStripe?: boolean | null;
  readonly guidanceTiles?: boolean | null;
};

export function getVisualSignsAvailable(
  visualSignsAvailable: StopRegistryLimitationStatusType | null | undefined,
  properties: GuidanceProperties | null | undefined,
): StopRegistryLimitationStatusType {
  if (visualSignsAvailable !== null && visualSignsAvailable !== undefined) {
    return visualSignsAvailable;
  }

  const hasVisualSigns =
    (Boolean(properties?.guidanceType) &&
      properties?.guidanceType !== StopRegistryGuidanceType.None) ||
    properties?.guidanceStripe === true ||
    properties?.guidanceTiles === true;

  return hasVisualSigns
    ? StopRegistryLimitationStatusType.True
    : StopRegistryLimitationStatusType.False;
}
