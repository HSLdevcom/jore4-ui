import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { mapSignContentTypeToUiName } from '../../../../../../i18n/uiNameMappings';
import { getGeometryPoint } from '../../../../../../utils';
import {
  ChangedValue,
  diffValues,
  mapNullable,
} from '../../../../../common/ChangeHistory';
import { HistoricalStopData } from '../../types';
import { optionalFmt } from './utils';

export function diffLocationDetails(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const previousPoint = getGeometryPoint(previous.quay.geometry);
  const currentPoint = getGeometryPoint(current.quay.geometry);

  const mapMeters = optionalFmt(
    new Intl.NumberFormat(t('languages.intlLangCode'), {
      style: 'unit',
      unit: 'meter',
    }),
  );

  const changes = [
    diffValues({
      field: t('stopDetails.location.streetAddress'),
      oldValue: previous.quay.streetAddress,
      newValue: current.quay.streetAddress,
    }),
    diffValues({
      field: t('stopDetails.location.postalCode'),
      oldValue: previous.quay.postalCode,
      newValue: current.quay.postalCode,
    }),
    diffValues({
      field: t('stopDetails.location.municipality'),
      oldValue: previous.stop_place.municipality,
      newValue: current.stop_place.municipality,
    }),
    diffValues({
      field: t('stopDetails.location.fareZone'),
      oldValue: previous.stop_place.fareZone,
      newValue: current.stop_place.fareZone,
    }),
    diffValues({
      field: t('stopDetails.location.latitude'),
      oldValue: previousPoint?.latitude,
      newValue: currentPoint?.latitude,
    }),
    diffValues({
      field: t('stopDetails.location.longitude'),
      oldValue: previousPoint?.longitude,
      newValue: currentPoint?.longitude,
    }),
    diffValues({
      field: t('stopDetails.location.altitude'),
      oldValue: previousPoint?.elevation,
      newValue: currentPoint?.elevation,
    }),
    diffValues({
      field: t('stopDetails.location.functionalArea'),
      oldValue: previous.quay.functionalArea,
      newValue: current.quay.functionalArea,
      mapper: mapMeters,
    }),
    diffValues({
      field: t('stopDetails.location.platformNumber'),
      oldValue:
        previous.quay.placeEquipments?.generalSign?.at(0)?.content?.value,
      newValue:
        current.quay.placeEquipments?.generalSign?.at(0)?.content?.value,
    }),
    diffValues({
      field: t('stopDetails.location.signContentType'),
      oldValue:
        previous.quay?.placeEquipments?.generalSign?.at(0)?.signContentType,
      newValue:
        current.quay?.placeEquipments?.generalSign?.at(0)?.signContentType,
      mapper: mapNullable((v) => mapSignContentTypeToUiName(t, v)),
    }),
  ];

  return compact(changes);
}
