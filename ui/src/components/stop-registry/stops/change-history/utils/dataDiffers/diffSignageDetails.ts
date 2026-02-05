import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { mapStopPlaceSignTypeToUiName } from '../../../../../../i18n/uiNameMappings';
import { StopPlaceSignType } from '../../../../../../types/stop-registry';
import {
  ChangedValue,
  diffValues,
  mapNullable,
} from '../../../../../common/ChangeHistory';
import { optionalBooleanToUiText } from '../../../stop-details/utils';
import { HistoricalStopData } from '../../types';

export function diffSignageDetails(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const previousGeneralSign =
    previous.quay?.placeEquipments?.generalSign?.at(0);
  const currentGeneralSign = current.quay?.placeEquipments?.generalSign?.at(0);

  const changes = [
    diffValues({
      field: t('stopDetails.signs.signType'),
      oldValue: previousGeneralSign?.privateCode?.value,
      newValue: currentGeneralSign?.privateCode?.value,
      mapper: mapNullable((v) =>
        mapStopPlaceSignTypeToUiName(t, v as StopPlaceSignType),
      ),
    }),
    diffValues({
      field: t('stopDetails.signs.numberOfFrames'),
      oldValue: previousGeneralSign?.numberOfFrames?.toString(10),
      newValue: currentGeneralSign?.numberOfFrames?.toString(10),
    }),
    diffValues({
      field: t('stopDetails.signs.signageInstructionExceptions'),
      oldValue: previousGeneralSign?.note?.value,
      newValue: currentGeneralSign?.note?.value,
    }),
    diffValues({
      field: t('stopDetails.signs.replacesRailSign'),
      oldValue: previousGeneralSign?.replacesRailSign,
      newValue: currentGeneralSign?.replacesRailSign,
      mapper: (v) => optionalBooleanToUiText(t, v),
    }),
  ];

  return compact(changes);
}
