import { useTranslation } from 'react-i18next';
import {
  StopRegistryGuidanceType,
  StopRegistryLimitationStatusType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import { showDangerToast } from '../../../../../utils';
import { getQuayIdsFromStopExcept } from '../useGetStopDetails';
import { calculateStopAccessibilityLevel } from './calculateStopAccessibilityLevel';
import { MeasurementsFormState } from './schema';

type EditTiamatParams = {
  readonly state: MeasurementsFormState;
  readonly stop: StopWithDetails;
};

function mapStopEditChangesToTiamatDbInput({ state, stop }: EditTiamatParams) {
  const stopPlaceId = stop.stop_place?.id;
  const stopPlaceQuayId = stop.stop_place_ref;

  const accessibilityAssessment = stop.quay?.accessibilityAssessment;
  const limitations = accessibilityAssessment?.limitations;
  const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

  const accessibilityLevel = calculateStopAccessibilityLevel({
    accessibilityAssessment: {
      hslAccessibilityProperties: state,
    },
    quays: [stop.quay],
  });

  return {
    id: stopPlaceId,
    quays: [
      ...otherQuays,
      {
        id: stopPlaceQuayId,
        accessibilityAssessment: {
          id: accessibilityAssessment?.id,
          // Limitations are required when submitting accessibility assessment
          limitations: {
            id: limitations?.id ?? null,
            audibleSignalsAvailable:
              limitations?.audibleSignalsAvailable ??
              StopRegistryLimitationStatusType.Unknown,
            escalatorFreeAccess:
              limitations?.escalatorFreeAccess ??
              StopRegistryLimitationStatusType.Unknown,
            liftFreeAccess:
              limitations?.liftFreeAccess ??
              StopRegistryLimitationStatusType.Unknown,
            stepFreeAccess:
              limitations?.stepFreeAccess ??
              StopRegistryLimitationStatusType.Unknown,
            wheelchairAccess:
              limitations?.wheelchairAccess ??
              StopRegistryLimitationStatusType.Unknown,
          },
          hslAccessibilityProperties: {
            id: accessibilityAssessment?.hslAccessibilityProperties?.id,
            stopAreaSideSlope: state.stopAreaSideSlope ?? null,
            stopAreaLengthwiseSlope: state.stopAreaLengthwiseSlope ?? null,
            endRampSlope: state.endRampSlope ?? null,
            shelterLaneDistance: state.shelterLaneDistance ?? null,
            curbBackOfRailDistance: state.curbBackOfRailDistance ?? null,
            curbDriveSideOfRailDistance:
              state.curbDriveSideOfRailDistance ?? null,
            structureLaneDistance: state.structureLaneDistance ?? null,
            stopElevationFromRailTop: state.stopElevationFromRailTop ?? null,
            stopElevationFromSidewalk: state.stopElevationFromSidewalk ?? null,
            lowerCleatHeight: state.lowerCleatHeight ?? null,
            serviceAreaWidth: state.serviceAreaWidth ?? null,
            serviceAreaLength: state.serviceAreaLength ?? null,
            platformEdgeWarningArea: state.platformEdgeWarningArea ?? null,
            guidanceTiles: state.guidanceTiles ?? null,
            guidanceStripe: state.guidanceStripe ?? null,
            serviceAreaStripes: state.serviceAreaStripes ?? null,
            sidewalkAccessibleConnection:
              state.sidewalkAccessibleConnection ?? null,
            stopAreaSurroundingsAccessible:
              state.stopAreaSurroundingsAccessible ?? null,
            curvedStop: state.curvedStop ?? null,
            stopType: state.stopType
              ? (state.stopType as StopRegistryStopType)
              : null,
            shelterType: state.shelterType
              ? (state.shelterType as StopRegistryShelterWidthType)
              : null,
            guidanceType: state.guidanceType
              ? (state.guidanceType as StopRegistryGuidanceType)
              : null,
            mapType: state.mapType
              ? (state.mapType as StopRegistryMapType)
              : null,
            pedestrianCrossingRampType: state.pedestrianCrossingRampType
              ? (state.pedestrianCrossingRampType as StopRegistryPedestrianCrossingRampType)
              : null,
            accessibilityLevel,
          },
        },
      },
    ],
  };
}

export function useEditStopMeasurementDetails() {
  const { t } = useTranslation();

  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const saveStopPlaceMeasurementDetails = ({ state, stop }: EditTiamatParams) =>
    updateStopPlaceMutation({
      variables: {
        input: mapStopEditChangesToTiamatDbInput({
          state,
          stop,
        }),
      },
      refetchQueries: [
        'GetStopDetails',
        'GetLatestQuayChange',
        'GetStopChangeHistory',
      ],
    });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t(($) => $.errors.saveFailed)}, ${err}`);
  };

  return {
    saveStopPlaceMeasurementDetails,
    defaultErrorHandler,
  };
}
