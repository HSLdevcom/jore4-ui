import { useTranslation } from 'react-i18next';
import { MeasurementsFormState } from '../../components/stop-registry/stops/stop-details/measurements/schema';
import {
  StopRegistryGuidanceType,
  StopRegistryLimitationStatusType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import {
  getRequiredStopPlaceMutationProperties,
  showDangerToast,
} from '../../utils';
import { useCalculateStopAccessibilityLevel } from './useCalculateStopAccessibilityLevel';
import { StopWithDetails } from './useGetStopDetails';

interface EditTiamatParams {
  state: MeasurementsFormState;
  stop: StopWithDetails;
}

export const useEditStopMeasurementDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();
  const { calculateStopAccessibilityLevel } =
    useCalculateStopAccessibilityLevel();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;

    const limitations = stop.quay?.accessibilityAssessment?.limitations;
    const accessibilityLevel = calculateStopAccessibilityLevel({
      accessibilityAssessment: {
        hslAccessibilityProperties: state,
      },
      quays: stop.stop_place?.quays,
    });

    const input = {
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      id: stopPlaceId,
      accessibilityAssessment: {
        id: stop.quay?.accessibilityAssessment?.id,
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
          id: stop.quay?.accessibilityAssessment?.hslAccessibilityProperties
            ?.id,
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
    };

    return input;
  };

  const prepareEditForTiamatDb = ({ state, stop }: EditTiamatParams) => {
    return {
      input: mapStopEditChangesToTiamatDbInput({
        state,
        stop,
      }),
    };
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveStopPlaceMeasurementDetails = async ({
    state,
    stop,
  }: {
    state: MeasurementsFormState;
    stop: StopWithDetails;
  }) => {
    await updateTiamatStopPlace({
      state,
      stop,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  return {
    saveStopPlaceMeasurementDetails,
    defaultErrorHandler,
  };
};
