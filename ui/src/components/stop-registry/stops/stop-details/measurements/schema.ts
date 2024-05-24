import { z } from 'zod';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
  nullableNumber,
} from '../../../../forms/common';

export const measurementsFormSchema = z.object({
  stopAreaSideSlope: nullableNumber,
  stopAreaLengthwiseSlope: nullableNumber,
  endRampSlope: nullableNumber,
  shelterLaneDistance: nullableNumber,
  curbBackOfRailDistance: nullableNumber,
  curbDriveSideOfRailDistance: nullableNumber,
  structureLaneDistance: nullableNumber,
  stopElevationFromRailTop: nullableNumber,
  stopElevationFromSidewalk: nullableNumber,
  lowerCleatHeight: nullableNumber,
  serviceAreaWidth: nullableNumber,
  serviceAreaLength: nullableNumber,
  platformEdgeWarningArea: nullableBoolean,
  guidanceTiles: nullableBoolean,
  guidanceStripe: nullableBoolean,
  serviceAreaStripes: nullableBoolean,
  sidewalkAccessibleConnection: nullableBoolean,
  stopAreaSurroundingsAccessible: nullableBoolean,
  curvedStop: nullableBoolean,
  stopType: createNullableEnum<StopRegistryStopType>(),
  shelterType: createNullableEnum<StopRegistryShelterWidthType>(),
  guidanceType: createNullableEnum<StopRegistryGuidanceType>(),
  mapType: createNullableEnum<StopRegistryMapType>(),
  pedestrianCrossingRampType:
    createNullableEnum<StopRegistryPedestrianCrossingRampType>(),
});

export type MeasurementsFormState = z.infer<typeof measurementsFormSchema>;
