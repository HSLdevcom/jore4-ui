import { TFunction } from 'i18next';
import {
  mapStopRegistryGuidanceTypeToUiName,
  mapStopRegistryMapTypeToUiName,
  mapStopRegistryPedestrianCrossingRampTypeToUiName,
  mapStopRegistryShelterWidthTypeToUiName,
  mapStopRegistryStopTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { staticSection } from './utils';

const metaHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.measurements.title'),
];

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.measurements.stopType'),
  (t) => t('stopDetails.measurements.curvedStop'),
  (t) => t('stopDetails.measurements.shelterType'),
  (t) => t('stopDetails.measurements.shelterLaneDistance'),
  (t) => t('stopDetails.measurements.curbBackOfRailDistance'),
  (t) => t('stopDetails.measurements.stopAreaSideSlope'),
  (t) => t('stopDetails.measurements.stopAreaLengthwiseSlope'),

  (t) => t('stopDetails.measurements.structureLaneDistance'),
  (t) => t('stopDetails.measurements.stopElevationFromRailTop'),
  (t) => t('stopDetails.measurements.stopElevationFromSidewalk'),
  (t) => t('stopDetails.measurements.lowerCleatHeight'),

  (t) => t('stopDetails.measurements.platformEdgeWarningArea'),
  (t) => t('stopDetails.measurements.sidewalkAccessibleConnection'),
  (t) => t('stopDetails.measurements.guidanceStripe'),
  (t) => t('stopDetails.measurements.serviceAreaStripes'),
  (t) => t('stopDetails.measurements.guidanceType'),
  (t) => t('stopDetails.measurements.guidanceTiles'),
  (t) => t('stopDetails.measurements.mapType'),

  (t) => t('stopDetails.measurements.curbDriveSideOfRailDistance'),
  (t) => t('stopDetails.measurements.endRampSlope'),
  (t) => t('stopDetails.measurements.serviceAreaWidth'),
  (t) => t('stopDetails.measurements.serviceAreaLength'),
  (t) => t('stopDetails.measurements.pedestrianCrossingRampType'),
  (t) => t('stopDetails.measurements.stopAreaSurroundingsAccessible'),
];

function writeRecordFields(
  writer: CSVWriter,
  { quay, stopPlace }: EnrichedStopDetails,
): void {
  const { t } = writer;
  const details = (
    quay.accessibilityAssessment ?? stopPlace.accessibilityAssessment
  )?.hslAccessibilityProperties;

  if (!details) {
    return writer.writeEmptyFields(headers.length);
  }

  writer.writeEnumField(details.stopType, mapStopRegistryStopTypeToUiName);
  writer.writeBooleanField(
    details.curvedStop,
    t('stopDetails.measurements.curvedStop'),
  );
  writer.writeEnumField(
    details.shelterType,
    mapStopRegistryShelterWidthTypeToUiName,
  );
  writer.writeNumberField(details.shelterLaneDistance);
  writer.writeNumberField(details.curbBackOfRailDistance);
  writer.writeNumberField(details.stopAreaSideSlope);
  writer.writeNumberField(details.stopAreaLengthwiseSlope);

  writer.writeNumberField(details.structureLaneDistance);
  writer.writeNumberField(details.stopElevationFromRailTop);
  writer.writeNumberField(details.stopElevationFromSidewalk);
  writer.writeNumberField(details.lowerCleatHeight);

  writer.writeBooleanField(
    details.platformEdgeWarningArea,
    t('stopDetails.measurements.platformEdgeWarningArea'),
  );
  writer.writeBooleanField(
    details.sidewalkAccessibleConnection,
    t('stopDetails.measurements.sidewalkAccessibleConnection'),
  );
  writer.writeBooleanField(
    details.guidanceStripe,
    t('stopDetails.measurements.guidanceStripe'),
  );
  writer.writeBooleanField(
    details.serviceAreaStripes,
    t('stopDetails.measurements.serviceAreaStripes'),
  );
  writer.writeEnumField(
    details.guidanceType,
    mapStopRegistryGuidanceTypeToUiName,
  );
  writer.writeBooleanField(
    details.guidanceTiles,
    t('stopDetails.measurements.guidanceTiles'),
  );
  writer.writeEnumField(details.mapType, mapStopRegistryMapTypeToUiName);

  writer.writeNumberField(details.curbDriveSideOfRailDistance);
  writer.writeNumberField(details.endRampSlope);
  writer.writeNumberField(details.serviceAreaWidth);
  writer.writeNumberField(details.serviceAreaLength);
  writer.writeEnumField(
    details.pedestrianCrossingRampType,
    mapStopRegistryPedestrianCrossingRampTypeToUiName,
  );
  writer.writeTextField(
    details.stopAreaSurroundingsAccessible
      ? t('stopDetails.measurements.accessible')
      : t('stopDetails.measurements.inaccessible'),
  );

  return undefined;
}

export const MeasurementsDetailsSection = staticSection(
  metaHeaders,
  headers,
  writeRecordFields,
);
