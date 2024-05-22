import isBoolean from 'lodash/isBoolean';
import isNumber from 'lodash/isNumber';
import {
  HslAccessibilityPropertiesDetailsFragment,
  ShelterEquipmentDetailsFragment,
  StopRegistryShelterType,
} from '../../generated/graphql';

export const enum StopAccessibilityLevel {
  FullyAccessible = 'FullyAccessible',
  MostlyAccessible = 'MostlyAccessible',
  PartiallyInaccessible = 'PartiallyInaccessible',
  Inaccessible = 'Inaccessible',
  Unknown = 'Unknown',
}

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
  quays?: Array<{
    placeEquipments?: {
      shelterEquipment?: Array<ShelterAccessibilityLevelCalculationProperties> | null;
    } | null;
  } | null> | null;
} | null;

export const useCalculateStopAccessibilityLevel = () => {
  const accessibleShelterTypes = [
    StopRegistryShelterType.Concrete,
    StopRegistryShelterType.Glass,
    StopRegistryShelterType.Steel,
    StopRegistryShelterType.Urban,
    StopRegistryShelterType.Wooden,
  ];
  // Note: having an accessible shelter also implies that the stop has a bench, which is required for accessibility as well.
  const shelterIsAccessible = (
    shelter: NonNullable<ShelterAccessibilityLevelCalculationProperties>,
  ) => {
    return (
      shelter.shelterLighting === true &&
      shelter.shelterType &&
      accessibleShelterTypes.includes(shelter.shelterType)
    );
  };

  const getShelterWithAccessibilityPropertiesSet = (
    stop: NonNullable<StopAccessibilityLevelCalculationProperties>,
  ) => {
    const shelters = stop?.quays?.[0]?.placeEquipments?.shelterEquipment || [];
    return (
      shelters.find((shelter) => {
        return !!shelter?.shelterType && isBoolean(shelter?.shelterLighting);
      }) || null
    );
  };

  const calculateStopAccessibilityLevel = (
    stop: StopAccessibilityLevelCalculationProperties | undefined,
  ) => {
    const measurements =
      stop?.accessibilityAssessment?.hslAccessibilityProperties;
    if (!measurements) {
      return StopAccessibilityLevel.Unknown;
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
      getShelterWithAccessibilityPropertiesSet(stop);

    if (
      !isNumber(serviceAreaWidth) ||
      !isNumber(elevation) ||
      !isNumber(stopAreaLengthwiseSlope) ||
      !isNumber(stopAreaSideSlope) ||
      !isBoolean(stopAreaSurroundingsAccessible) ||
      !isBoolean(platformEdgeWarningArea) ||
      !shelterWithAccessibilityProperties
    ) {
      return StopAccessibilityLevel.Unknown;
    }

    const hasHighAccessibilityProperties =
      stopAreaSurroundingsAccessible &&
      platformEdgeWarningArea &&
      shelterIsAccessible(shelterWithAccessibilityProperties);

    if (
      serviceAreaWidth >= 150 &&
      elevation >= limits.highAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 3 &&
      stopAreaSideSlope <= 2 &&
      hasHighAccessibilityProperties
    ) {
      return StopAccessibilityLevel.FullyAccessible;
    }

    if (
      serviceAreaWidth >= 150 &&
      elevation >= limits.highAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 5 &&
      stopAreaSideSlope <= 3 &&
      hasHighAccessibilityProperties
    ) {
      return StopAccessibilityLevel.MostlyAccessible;
    }

    if (
      serviceAreaWidth >= 120 &&
      elevation >= limits.lowAccessibilityElevationLowerLimit &&
      elevation <= limits.highAccessibilityElevationUpperLimit &&
      stopAreaLengthwiseSlope <= 8 &&
      stopAreaSideSlope <= 5
    ) {
      return StopAccessibilityLevel.PartiallyInaccessible;
    }

    return StopAccessibilityLevel.Inaccessible;
  };

  return {
    calculateStopAccessibilityLevel,
  };
};
