import { z } from 'zod';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import { nullableNumber } from '../../../../forms/common';

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
  // TODO: make sure these can be nulled.
  platformEdgeWarningArea: z.boolean().nullable(),
  guidanceTiles: z.boolean().nullable(),
  guidanceStripe: z.boolean().nullable(),
  serviceAreaStripes: z.boolean().nullable(),
  sidewalkAccessibleConnection: z.boolean().nullable(),
  stopAreaSurroundingsAccessible: z.boolean().nullable(),
  curvedStop: z.boolean().nullable(),
  stopType: z.nativeEnum(StopRegistryStopType).nullable(),
  shelterType: z.nativeEnum(StopRegistryShelterType).nullable(),
  guidanceType: z.nativeEnum(StopRegistryGuidanceType).nullable(),
  mapType: z.nativeEnum(StopRegistryMapType).nullable(),
  pedestrianCrossingRampType: z
    .nativeEnum(StopRegistryPedestrianCrossingRampType)
    .nullable(),
});

export type MeasurementsFormState = z.infer<typeof measurementsFormSchema>;
