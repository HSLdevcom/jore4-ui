import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import {
  HslAccessibilityPropertiesDetailsFragment,
  ShelterEquipmentDetailsFragment,
  StopRegistryAccessibilityLevel,
  StopRegistryShelterType,
} from '../../../../../generated/graphql';

export type HslAccessibilityLevelCalculationProperties = Pick<
  HslAccessibilityPropertiesDetailsFragment,
  | 'serviceAreaWidth'
  | 'stopAreaSideSlope'
  | 'stopAreaLengthwiseSlope'
  | 'stopElevationFromSidewalk'
  | 'stopElevationFromRailTop'
  | 'platformEdgeWarningArea'
  | 'stopAreaSurroundingsAccessible'
> | null;

export type ShelterAccessibilityLevelCalculationProperties = Pick<
  ShelterEquipmentDetailsFragment,
  'shelterType' | 'shelterLighting'
> | null;

export type StopAccessibilityLevelCalculationProperties = {
  accessibilityAssessment?: {
    hslAccessibilityProperties?: HslAccessibilityLevelCalculationProperties;
  } | null;
  quays?: ReadonlyArray<{
    placeEquipments?: {
      shelterEquipment?: ReadonlyArray<ShelterAccessibilityLevelCalculationProperties> | null;
    } | null;
  } | null> | null;
} | null;

export const useCalculateStopAccessibilityLevel = () => {
  // A bench is required for the stop to be accessible.
  // We don't have a bench defined separately in our data model,
  // so we check if one exists based on stop type instead.
  const shelterTypesWithBench = [
    StopRegistryShelterType.Concrete,
    StopRegistryShelterType.Glass,
    StopRegistryShelterType.Steel,
    StopRegistryShelterType.Urban,
    StopRegistryShelterType.Wooden,
  ];

  const isShelterAccessible = (
    shelter: NonNullable<ShelterAccessibilityLevelCalculationProperties>,
  ) => {
    return (
      shelter.shelterLighting === true &&
      shelter.shelterType &&
      shelterTypesWithBench.includes(shelter.shelterType)
    );
  };

  const findShelterWithAccessibilityPropertiesSet = (
    stop: NonNullable<StopAccessibilityLevelCalculationProperties>,
  ) => {
    const shelters = stop?.quays?.[0]?.placeEquipments?.shelterEquipment ?? [];
    return (
      shelters.find(
        (shelter) =>
          !!shelter?.shelterType && isBoolean(shelter?.shelterLighting),
      ) ?? null
    );
  };

  const calculateStopAccessibilityLevel = (
    stop: StopAccessibilityLevelCalculationProperties | undefined,
  ) => {
    const measurements =
      stop?.accessibilityAssessment?.hslAccessibilityProperties;
    if (!measurements) {
      return StopRegistryAccessibilityLevel.Unknown;
    }

    const {
      serviceAreaWidth,
      stopAreaSideSlope,
      stopAreaLengthwiseSlope,
      stopElevationFromSidewalk,
      // stopElevationFromRailTop, // This should be used for trams
      platformEdgeWarningArea,
      stopAreaSurroundingsAccessible,
    } = measurements;
    const busLimits = {
      highAccessibilityElevationUpperLimit: 25,
      highAccessibilityElevationLowerLimit: 16,
      lowAccessibilityElevationLowerLimit: 12,
    };
    // Trams use different limits.
    // TODO: use these when dealing with trams.
    // const tramLimits = {
    //   highAccessibilityElevationUpperLimit = 30,
    //   highAccessibilityElevationLowerLimit = 25,
    //   lowAccessibilityElevationLowerLimit = 20
    // };
    const limits = busLimits;
    const elevation = stopElevationFromSidewalk;
    const shelterWithAccessibilityProperties =
      findShelterWithAccessibilityPropertiesSet(stop);

    if (
      !isNumber(serviceAreaWidth) ||
      !isNumber(elevation) ||
      !isNumber(stopAreaLengthwiseSlope) ||
      !isNumber(stopAreaSideSlope) ||
      !isBoolean(stopAreaSurroundingsAccessible) ||
      !isBoolean(platformEdgeWarningArea) ||
      !shelterWithAccessibilityProperties
    ) {
      return StopRegistryAccessibilityLevel.Unknown;
    }

    const hasHighAccessibilityProperties =
      stopAreaSurroundingsAccessible &&
      platformEdgeWarningArea &&
      isShelterAccessible(shelterWithAccessibilityProperties);

    if (
      serviceAreaWidth >= 1.5 &&
      elevation >= limits.highAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 3 &&
      stopAreaSideSlope <= 2 &&
      hasHighAccessibilityProperties
    ) {
      return StopRegistryAccessibilityLevel.FullyAccessible;
    }

    if (
      serviceAreaWidth >= 1.5 &&
      elevation >= limits.highAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 5 &&
      stopAreaSideSlope <= 3 &&
      hasHighAccessibilityProperties
    ) {
      return StopRegistryAccessibilityLevel.MostlyAccessible;
    }

    if (
      serviceAreaWidth >= 1.2 &&
      elevation >= limits.lowAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 8 &&
      stopAreaSideSlope <= 5
    ) {
      return StopRegistryAccessibilityLevel.PartiallyInaccessible;
    }

    return StopRegistryAccessibilityLevel.Inaccessible;
  };

  return {
    calculateStopAccessibilityLevel,
  };
};
