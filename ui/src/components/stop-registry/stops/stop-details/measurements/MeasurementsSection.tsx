import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import {
  StopWithDetails,
  useEditStopMeasurementDetails,
  useToggle,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { MeasurementsForm } from './MeasurementsForm';
import { MeasurementsViewCard } from './MeasurementsViewCard';
import { MeasurementsFormState } from './schema';

interface Props {
  stop: StopWithDetails;
}

const mapMeasurementsDataToFormState = (
  stop: StopWithDetails,
): Partial<MeasurementsFormState> => {
  const accessibilityProps =
    stop.stop_place?.accessibilityAssessment?.hslAccessibilityProperties || {};
  return {
    stopAreaSideSlope: accessibilityProps.stopAreaSideSlope ?? null,
    stopAreaLengthwiseSlope: accessibilityProps.stopAreaLengthwiseSlope ?? null,
    endRampSlope: accessibilityProps.endRampSlope ?? null,
    shelterLaneDistance: accessibilityProps.shelterLaneDistance ?? null,
    curbBackOfRailDistance: accessibilityProps.curbBackOfRailDistance ?? null,
    curbDriveSideOfRailDistance:
      accessibilityProps.curbDriveSideOfRailDistance ?? null,
    structureLaneDistance: accessibilityProps.structureLaneDistance ?? null,
    stopElevationFromRailTop:
      accessibilityProps.stopElevationFromRailTop ?? null,
    stopElevationFromSidewalk:
      accessibilityProps.stopElevationFromSidewalk ?? null,
    lowerCleatHeight: accessibilityProps.lowerCleatHeight ?? null,
    serviceAreaWidth: accessibilityProps.serviceAreaWidth ?? null,
    serviceAreaLength: accessibilityProps.serviceAreaLength ?? null,
    platformEdgeWarningArea: accessibilityProps.platformEdgeWarningArea ?? null,
    guidanceTiles: accessibilityProps.guidanceTiles ?? null,
    guidanceStripe: accessibilityProps.guidanceStripe ?? null,
    serviceAreaStripes: accessibilityProps.serviceAreaStripes ?? null,
    sidewalkAccessibleConnection:
      accessibilityProps.sidewalkAccessibleConnection ?? null,
    stopAreaSurroundingsAccessible:
      accessibilityProps.stopAreaSurroundingsAccessible ?? null,
    curvedStop: accessibilityProps.curvedStop ?? null,
    stopType: accessibilityProps.stopType
      ? (accessibilityProps.stopType as StopRegistryStopType)
      : null,
    shelterType: accessibilityProps.shelterType
      ? (accessibilityProps.shelterType as StopRegistryShelterType)
      : null,
    guidanceType: accessibilityProps.guidanceType
      ? (accessibilityProps.guidanceType as StopRegistryGuidanceType)
      : null,
    mapType: accessibilityProps.mapType
      ? (accessibilityProps.mapType as StopRegistryMapType)
      : null,
    pedestrianCrossingRampType: accessibilityProps.pedestrianCrossingRampType
      ? (accessibilityProps.pedestrianCrossingRampType as StopRegistryPedestrianCrossingRampType)
      : null,
  };
};

export const MeasurementsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { saveStopPlaceMeasurementDetails, defaultErrorHandler } =
    useEditStopMeasurementDetails();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: MeasurementsFormState) => {
    try {
      await saveStopPlaceMeasurementDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapMeasurementsDataToFormState(stop);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.measurements.title')}
      testIdPrefix="MeasurementsSection"
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode && !!defaultValues ? (
        <MeasurementsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <MeasurementsViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};