import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  mapStopRegistryGuidanceTypeToUiName,
  mapStopRegistryMapTypeToUiName,
  mapStopRegistryPedestrianCrossingRampTypeToUiName,
  mapStopRegistryShelterWidthTypeToUiName,
  mapStopRegistryStopTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { DetailRow, LabeledDetail } from '../layout';
import {
  extractRelevantAccessibilityAssessment,
  optionalBooleanToCustomUiText,
  optionalBooleanToUiText,
} from '../utils';

const testIds = {
  container: 'MeasurementsViewCard::container',
  stopType: 'MeasurementsViewCard::stopType',
  curvedStop: 'MeasurementsViewCard::curvedStop',
  shelterType: 'MeasurementsViewCard::shelterType',
  shelterLaneDistance: 'MeasurementsViewCard::shelterLaneDistance',
  curbBackOfRailDistance: 'MeasurementsViewCard::curbBackOfRailDistance',
  stopAreaSideSlope: 'MeasurementsViewCard::stopAreaSideSlope',
  stopAreaLengthwiseSlope: 'MeasurementsViewCard::stopAreaLengthwiseSlope',
  structureLaneDistance: 'MeasurementsViewCard::structureLaneDistance',
  stopElevationFromRailTop: 'MeasurementsViewCard::stopElevationFromRailTop',
  stopElevationFromSidewalk: 'MeasurementsViewCard::stopElevationFromSidewalk',
  lowerCleatHeight: 'MeasurementsViewCard::lowerCleatHeight',
  curbDriveSideOfRailDistance:
    'MeasurementsViewCard::curbDriveSideOfRailDistance',
  endRampSlope: 'MeasurementsViewCard::endRampSlope',
  serviceAreaWidth: 'MeasurementsViewCard::serviceAreaWidth',
  serviceAreaLength: 'MeasurementsViewCard::serviceAreaLength',
  pedestrianCrossingRampType:
    'MeasurementsViewCard::pedestrianCrossingRampType',
  stopAreaSurroundingsAccessible:
    'MeasurementsViewCard::stopAreaSurroundingsAccessible',
  guidanceType: 'MeasurementsViewCard::guidanceType',
  mapType: 'MeasurementsViewCard::mapType',
  platformEdgeWarningArea: 'MeasurementsViewCard::platformEdgeWarningArea',
  sidewalkAccessibleConnection:
    'MeasurementsViewCard::sidewalkAccessibleConnection',
  guidanceStripe: 'MeasurementsViewCard::guidanceStripe',
  serviceAreaStripes: 'MeasurementsViewCard::serviceAreaStripes',
  guidanceTiles: 'MeasurementsViewCard::guidanceTiles',
};

type MeasurementsViewCardProps = {
  readonly stop: StopWithDetails;
};

export const MeasurementsViewCard: FC<MeasurementsViewCardProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  const accessibilityProps =
    extractRelevantAccessibilityAssessment(stop)?.hslAccessibilityProperties;

  const stopType =
    accessibilityProps?.stopType &&
    mapStopRegistryStopTypeToUiName(t, accessibilityProps.stopType);
  const shelterType =
    accessibilityProps?.shelterType &&
    mapStopRegistryShelterWidthTypeToUiName(t, accessibilityProps.shelterType);
  const pedestrianCrossingRampType =
    accessibilityProps?.pedestrianCrossingRampType &&
    mapStopRegistryPedestrianCrossingRampTypeToUiName(
      t,
      accessibilityProps.pedestrianCrossingRampType,
    );
  const guidanceType =
    accessibilityProps?.guidanceType &&
    mapStopRegistryGuidanceTypeToUiName(t, accessibilityProps.guidanceType);
  const mapType =
    accessibilityProps?.mapType &&
    mapStopRegistryMapTypeToUiName(t, accessibilityProps.mapType);

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.measurements.stopType')}
          detail={stopType}
          testId={testIds.stopType}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.curvedStop')}
          detail={optionalBooleanToUiText(t, accessibilityProps?.curvedStop)}
          testId={testIds.curvedStop}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.shelterType')}
          detail={shelterType}
          testId={testIds.shelterType}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.shelterLaneDistance')}
          detail={accessibilityProps?.shelterLaneDistance}
          testId={testIds.shelterLaneDistance}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.curbBackOfRailDistance')}
          detail={accessibilityProps?.curbBackOfRailDistance}
          testId={testIds.curbBackOfRailDistance}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.stopAreaSideSlope')}
          detail={accessibilityProps?.stopAreaSideSlope}
          testId={testIds.stopAreaSideSlope}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.stopAreaLengthwiseSlope')}
          detail={accessibilityProps?.stopAreaLengthwiseSlope}
          testId={testIds.stopAreaLengthwiseSlope}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.measurements.structureLaneDistance')}
          detail={accessibilityProps?.structureLaneDistance}
          testId={testIds.structureLaneDistance}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.stopElevationFromRailTop')}
          detail={accessibilityProps?.stopElevationFromRailTop}
          testId={testIds.stopElevationFromRailTop}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.stopElevationFromSidewalk')}
          detail={accessibilityProps?.stopElevationFromSidewalk}
          testId={testIds.stopElevationFromSidewalk}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.lowerCleatHeight')}
          detail={accessibilityProps?.lowerCleatHeight}
          testId={testIds.lowerCleatHeight}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.measurements.platformEdgeWarningArea')}
          detail={optionalBooleanToUiText(
            t,
            accessibilityProps?.platformEdgeWarningArea,
          )}
          testId={testIds.platformEdgeWarningArea}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.sidewalkAccessibleConnection')}
          detail={optionalBooleanToUiText(
            t,
            accessibilityProps?.sidewalkAccessibleConnection,
          )}
          testId={testIds.sidewalkAccessibleConnection}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.guidanceStripe')}
          detail={optionalBooleanToUiText(
            t,
            accessibilityProps?.guidanceStripe,
          )}
          testId={testIds.guidanceStripe}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.serviceAreaStripes')}
          detail={optionalBooleanToUiText(
            t,
            accessibilityProps?.serviceAreaStripes,
          )}
          testId={testIds.serviceAreaStripes}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.guidanceType')}
          detail={guidanceType}
          testId={testIds.guidanceType}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.guidanceTiles')}
          detail={optionalBooleanToUiText(t, accessibilityProps?.guidanceTiles)}
          testId={testIds.guidanceTiles}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.mapType')}
          detail={mapType}
          testId={testIds.mapType}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.measurements.curbDriveSideOfRailDistance')}
          detail={accessibilityProps?.curbDriveSideOfRailDistance}
          testId={testIds.curbDriveSideOfRailDistance}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.endRampSlope')}
          detail={accessibilityProps?.endRampSlope}
          testId={testIds.endRampSlope}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.serviceAreaWidth')}
          detail={accessibilityProps?.serviceAreaWidth}
          testId={testIds.serviceAreaWidth}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.serviceAreaLength')}
          detail={accessibilityProps?.serviceAreaLength}
          testId={testIds.serviceAreaLength}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.pedestrianCrossingRampType')}
          detail={pedestrianCrossingRampType}
          testId={testIds.pedestrianCrossingRampType}
        />
        <LabeledDetail
          title={t('stopDetails.measurements.stopAreaSurroundingsAccessible')}
          detail={optionalBooleanToCustomUiText(
            accessibilityProps?.stopAreaSurroundingsAccessible,
            t('stopDetails.measurements.accessible'),
            t('stopDetails.measurements.inaccessible'),
          )}
          testId={testIds.stopAreaSurroundingsAccessible}
        />
      </DetailRow>
    </div>
  );
};
