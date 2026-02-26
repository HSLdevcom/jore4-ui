import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  mapStopRegistryGuidanceTypeToUiName,
  mapStopRegistryMapTypeToUiName,
  mapStopRegistryPedestrianCrossingRampTypeToUiName,
  mapStopRegistryShelterWidthTypeToUiName,
  mapStopRegistryStopTypeToUiName,
} from '../../../../../../i18n/uiNameMappings';
import {
  ChangedValue,
  diffKeyedValues,
  mapNullable,
} from '../../../../../common/ChangeHistory';
import {
  optionalBooleanToCustomUiText,
  optionalBooleanToUiText,
} from '../../../stop-details/utils';
import { HistoricalStopData } from '../../types';
import { optionalFmt } from './utils';

export function diffMeasurementDetails(
  t: TFunction,
  previousData: HistoricalStopData,
  currentData: HistoricalStopData,
): Array<ChangedValue> {
  const previous = (
    previousData.quay.accessibilityAssessment ??
    previousData.stop_place.accessibilityAssessment
  )?.hslAccessibilityProperties;
  const current = (
    currentData.quay.accessibilityAssessment ??
    currentData.stop_place.accessibilityAssessment
  )?.hslAccessibilityProperties;

  const langCode = t('languages.intlLangCode');

  const mapCentimeters = optionalFmt(
    new Intl.NumberFormat(langCode, {
      style: 'unit',
      unit: 'centimeter',
    }),
  );
  const mapMeters = optionalFmt(
    new Intl.NumberFormat(langCode, {
      style: 'unit',
      unit: 'meter',
    }),
  );
  const mapPercentage = optionalFmt(
    new Intl.NumberFormat(langCode, {
      style: 'percent',
    }),
  );

  const changes = [
    diffKeyedValues({
      key: 'StopType',
      field: t('stopDetails.measurements.stopType'),
      oldValue: previous?.stopType,
      newValue: current?.stopType,
      mapper: mapNullable((v) => mapStopRegistryStopTypeToUiName(t, v)),
    }),
    diffKeyedValues({
      key: 'CurvedStop',
      field: t('stopDetails.measurements.curvedStop'),
      oldValue: previous?.curvedStop,
      newValue: current?.curvedStop,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'ShelterType',
      field: t('stopDetails.measurements.shelterType'),
      oldValue: previous?.shelterType,
      newValue: current?.shelterType,
      mapper: mapNullable((v) => mapStopRegistryShelterWidthTypeToUiName(t, v)),
    }),

    diffKeyedValues({
      key: 'ShelterLaneDistance',
      field: t('stopDetails.measurements.shelterLaneDistance'),
      oldValue: previous?.shelterLaneDistance,
      newValue: current?.shelterLaneDistance,
      mapper: mapCentimeters,
    }),
    diffKeyedValues({
      key: 'CurbBackOfRailDistance',
      field: t('stopDetails.measurements.curbBackOfRailDistance'),
      oldValue: previous?.curbBackOfRailDistance,
      newValue: current?.curbBackOfRailDistance,
      mapper: mapCentimeters,
    }),

    diffKeyedValues({
      key: 'StopAreaSideSlope',
      field: t('stopDetails.measurements.stopAreaSideSlope'),
      oldValue: previous?.stopAreaSideSlope,
      newValue: current?.stopAreaSideSlope,
      mapper: mapPercentage,
    }),
    diffKeyedValues({
      key: 'StopAreaLengthwiseSlope',
      field: t('stopDetails.measurements.stopAreaLengthwiseSlope'),
      oldValue: previous?.stopAreaLengthwiseSlope,
      newValue: current?.stopAreaLengthwiseSlope,
      mapper: mapPercentage,
    }),

    diffKeyedValues({
      key: 'StructureLaneDistance',
      field: t('stopDetails.measurements.structureLaneDistance'),
      oldValue: previous?.structureLaneDistance,
      newValue: current?.structureLaneDistance,
      mapper: mapCentimeters,
    }),
    diffKeyedValues({
      key: 'StopElevationFromRailTop',
      field: t('stopDetails.measurements.stopElevationFromRailTop'),
      oldValue: previous?.stopElevationFromRailTop,
      newValue: current?.stopElevationFromRailTop,
      mapper: mapCentimeters,
    }),
    diffKeyedValues({
      key: 'StopElevationFromSidewalk',
      field: t('stopDetails.measurements.stopElevationFromSidewalk'),
      oldValue: previous?.stopElevationFromSidewalk,
      newValue: current?.stopElevationFromSidewalk,
      mapper: mapCentimeters,
    }),
    diffKeyedValues({
      key: 'LowerCleatHeight',
      field: t('stopDetails.measurements.lowerCleatHeight'),
      oldValue: previous?.lowerCleatHeight,
      newValue: current?.lowerCleatHeight,
      mapper: mapCentimeters,
    }),

    diffKeyedValues({
      key: 'PlatformEdgeWarningArea',
      field: t('stopDetails.measurements.platformEdgeWarningArea'),
      oldValue: previous?.platformEdgeWarningArea,
      newValue: current?.platformEdgeWarningArea,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'SidewalkAccessibleConnection',
      field: t('stopDetails.measurements.sidewalkAccessibleConnection'),
      oldValue: previous?.sidewalkAccessibleConnection,
      newValue: current?.sidewalkAccessibleConnection,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'GuidanceStripe',
      field: t('stopDetails.measurements.guidanceStripe'),
      oldValue: previous?.guidanceStripe,
      newValue: current?.guidanceStripe,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'ServiceAreaStripes',
      field: t('stopDetails.measurements.serviceAreaStripes'),
      oldValue: previous?.serviceAreaStripes,
      newValue: current?.serviceAreaStripes,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'GuidanceType',
      field: t('stopDetails.measurements.guidanceType'),
      oldValue: previous?.guidanceType,
      newValue: current?.guidanceType,
      mapper: mapNullable((v) => mapStopRegistryGuidanceTypeToUiName(t, v)),
    }),
    diffKeyedValues({
      key: 'GuidanceTiles',
      field: t('stopDetails.measurements.guidanceTiles'),
      oldValue: previous?.guidanceTiles,
      newValue: current?.guidanceTiles,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
    diffKeyedValues({
      key: 'MapType',
      field: t('stopDetails.measurements.mapType'),
      oldValue: previous?.mapType,
      newValue: current?.mapType,
      mapper: mapNullable((v) => mapStopRegistryMapTypeToUiName(t, v)),
    }),

    diffKeyedValues({
      key: 'CurbDriveSideOfRailDistance',
      field: t('stopDetails.measurements.curbDriveSideOfRailDistance'),
      oldValue: previous?.curbDriveSideOfRailDistance,
      newValue: current?.curbDriveSideOfRailDistance,
      mapper: mapCentimeters,
    }),
    diffKeyedValues({
      key: 'EndRampSlope',
      field: t('stopDetails.measurements.endRampSlope'),
      oldValue: previous?.endRampSlope,
      newValue: current?.endRampSlope,
      mapper: mapPercentage,
    }),
    diffKeyedValues({
      key: 'ServiceAreaWidth',
      field: t('stopDetails.measurements.serviceAreaWidth'),
      oldValue: previous?.serviceAreaWidth,
      newValue: current?.serviceAreaWidth,
      mapper: mapMeters,
    }),
    diffKeyedValues({
      key: 'ServiceAreaLength',
      field: t('stopDetails.measurements.serviceAreaLength'),
      oldValue: previous?.serviceAreaLength,
      newValue: current?.serviceAreaLength,
      mapper: mapMeters,
    }),
    diffKeyedValues({
      key: 'PedestrianCrossingRampType',
      field: t('stopDetails.measurements.pedestrianCrossingRampType'),
      oldValue: previous?.pedestrianCrossingRampType,
      newValue: current?.pedestrianCrossingRampType,
      mapper: mapNullable((v) =>
        mapStopRegistryPedestrianCrossingRampTypeToUiName(t, v),
      ),
    }),
    diffKeyedValues({
      key: 'StopAreaSurroundingsAccessible',
      field: t('stopDetails.measurements.stopAreaSurroundingsAccessible'),
      oldValue: previous?.stopAreaSurroundingsAccessible,
      newValue: current?.stopAreaSurroundingsAccessible,
      mapper: (v) =>
        optionalBooleanToCustomUiText(
          v,
          t('stopDetails.measurements.accessible'),
          t('stopDetails.measurements.inaccessible'),
        ),
    }),
  ];

  return compact(changes);
}
