import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopRegistryGuidanceType,
  StopRegistryMapType,
  StopRegistryPedestrianCrossingRampType,
  StopRegistryShelterWidthType,
  StopRegistryStopType,
} from '../../../../../generated/graphql';
import {
  StopWithDetails,
  useEditStopMeasurementDetails,
} from '../../../../../hooks';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { AccessibilityLevelInfo } from './AccessibilityLevelInfo';
import { MeasurementsForm } from './MeasurementsForm';
import { MeasurementsViewCard } from './MeasurementsViewCard';
import { MeasurementsFormState } from './schema';

const testIds = {
  prefix: 'MeasurementsSection',
  accessibilityLevel: 'MeasurementsSection::accessibilityLevel',
};

interface Props {
  stop: StopWithDetails;
}

const mapMeasurementsDataToFormState = (
  stop: StopWithDetails,
): Partial<MeasurementsFormState> => {
  const accessibilityProps =
    stop.quay?.accessibilityAssessment?.hslAccessibilityProperties ?? {};
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
      ? (accessibilityProps.shelterType as StopRegistryShelterWidthType)
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

export const MeasurementsSection = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();

  const { saveStopPlaceMeasurementDetails, defaultErrorHandler } =
    useEditStopMeasurementDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const onSubmit = async (state: MeasurementsFormState) => {
    try {
      await saveStopPlaceMeasurementDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapMeasurementsDataToFormState(stop);

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={
        <div className="flex items-start">
          <h4>{t('stopDetails.measurements.title')}</h4>
          <div className="mx-4 h-8 border-l border-dark-grey"> </div>
          <AccessibilityLevelInfo stop={stop} />
        </div>
      }
      testIdPrefix={testIds.prefix}
    >
      {infoContainerControls.isInEditMode && !!defaultValues ? (
        <MeasurementsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <MeasurementsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
