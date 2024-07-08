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
  nullablePositiveNumber
} from '../../../../forms/common';

export const measurementsFormSchema = z.object({
  stopAreaSideSlope: nullableNumber,
  stopAreaLengthwiseSlope: nullablePositiveNumber,
  endRampSlope: nullableNumber,
  shelterLaneDistance: nullablePositiveNumber,
  curbBackOfRailDistance: nullablePositiveNumber,
  curbDriveSideOfRailDistance: nullablePositiveNumber,
  structureLaneDistance: nullablePositiveNumber,
  stopElevationFromRailTop: nullablePositiveNumber,
  stopElevationFromSidewalk: nullablePositiveNumber,
  lowerCleatHeight: nullablePositiveNumber,
  serviceAreaWidth: nullablePositiveNumber,
  serviceAreaLength: nullablePositiveNumber,
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
