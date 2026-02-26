import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { ShelterEquipmentDetailsFragment } from '../../../../../../generated/graphql';
import {
  mapStopRegistryShelterConditionEnumToUiName,
  mapStopRegistryShelterElectricityEnumToUiName,
  mapStopRegistryShelterTypeEnumToUiName,
} from '../../../../../../i18n/uiNameMappings';
import {
  ChangedValue,
  EmptyCell,
  KeyedChangedValue,
  diffKeyedValues,
  mapNullable,
} from '../../../../../common/ChangeHistory';
import { optionalBooleanToUiText } from '../../../stop-details/utils';
import { HistoricalStopData } from '../../types';
import { diffNestedItems } from './diffNestedItems';

function diffShelterVersions(
  t: TFunction,
  previous: ShelterEquipmentDetailsFragment | null | undefined,
  current: ShelterEquipmentDetailsFragment | null | undefined,
): Array<KeyedChangedValue> {
  const mapBoolean = (v: boolean | undefined | null) =>
    optionalBooleanToUiText(t, v);

  return compact([
    diffKeyedValues({
      key: 'ShelterNumber',
      field: t('stopDetails.shelters.shelterNumber'),
      oldValue: previous?.shelterNumber,
      newValue: current?.shelterNumber,
    }),
    diffKeyedValues({
      key: 'ShelterExternalId',
      field: t('stopDetails.shelters.shelterExternalId'),
      oldValue: previous?.shelterExternalId,
      newValue: current?.shelterExternalId,
    }),
    diffKeyedValues({
      key: 'ShelterType',
      field: t('stopDetails.shelters.shelterType'),
      oldValue: previous?.shelterType,
      newValue: current?.shelterType,
      mapper: mapNullable((v) => mapStopRegistryShelterTypeEnumToUiName(t, v)),
    }),
    diffKeyedValues({
      key: 'ShelterElectricity',
      field: t('stopDetails.shelters.shelterElectricity'),
      oldValue: previous?.shelterElectricity,
      newValue: current?.shelterElectricity,
      mapper: mapNullable((v) =>
        mapStopRegistryShelterElectricityEnumToUiName(t, v),
      ),
    }),
    diffKeyedValues({
      key: 'ShelterLighting',
      field: t('stopDetails.shelters.shelterLighting'),
      oldValue: previous?.shelterLighting,
      newValue: current?.shelterLighting,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'ShelterCondition',
      field: t('stopDetails.shelters.shelterCondition'),
      oldValue: previous?.shelterCondition,
      newValue: current?.shelterCondition,
      mapper: mapNullable((v) =>
        mapStopRegistryShelterConditionEnumToUiName(t, v),
      ),
    }),
    diffKeyedValues({
      key: 'TimetableCabinets',
      field: t('stopDetails.shelters.timetableCabinets'),
      oldValue: previous?.timetableCabinets,
      newValue: current?.timetableCabinets,
    }),
    diffKeyedValues({
      key: 'TrashCan',
      field: t('stopDetails.shelters.trashCan'),
      oldValue: previous?.trashCan,
      newValue: current?.trashCan,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'ShelterHasDisplay',
      field: t('stopDetails.shelters.shelterHasDisplay'),
      oldValue: previous?.shelterHasDisplay,
      newValue: current?.shelterHasDisplay,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'BicycleParking',
      field: t('stopDetails.shelters.bicycleParking'),
      oldValue: previous?.bicycleParking,
      newValue: current?.bicycleParking,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'LeaningRail',
      field: t('stopDetails.shelters.leaningRail'),
      oldValue: previous?.leaningRail,
      newValue: current?.leaningRail,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'OutsideBench',
      field: t('stopDetails.shelters.outsideBench'),
      oldValue: previous?.outsideBench,
      newValue: current?.outsideBench,
      mapper: mapBoolean,
    }),
    diffKeyedValues({
      key: 'ShelterFasciaBoardTaping',
      field: t('stopDetails.shelters.shelterFasciaBoardTaping'),
      oldValue: previous?.shelterFasciaBoardTaping,
      newValue: current?.shelterFasciaBoardTaping,
      mapper: mapBoolean,
    }),
  ]);
}

function getAddedShelterHeading(
  t: TFunction,
  shelter: ShelterEquipmentDetailsFragment,
): ChangedValue {
  return {
    key: `Added::${shelter.id}`,
    field: null,
    oldValue: <EmptyCell />,
    newValue: (
      <span className="font-bold">{t('stopChangeHistory.shelters.added')}</span>
    ),
  };
}

function getUpdatedShelterHeading(
  t: TFunction,
  previous: ShelterEquipmentDetailsFragment,
  // current: ShelterEquipmentDetailsFragment,
): ChangedValue {
  return {
    key: `Updated::${previous.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t('stopChangeHistory.shelters.updated')}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}

function getRemovedShelterHeading(
  t: TFunction,
  shelter: ShelterEquipmentDetailsFragment,
): ChangedValue {
  return {
    key: `Removed::${shelter.id}`,
    field: null,
    oldValue: (
      <span className="font-bold">
        {t('stopChangeHistory.shelters.removed')}
      </span>
    ),
    newValue: <EmptyCell />,
  };
}

export function diffShelters(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  return diffNestedItems({
    t,
    previousItems: previous.quay.placeEquipments?.shelterEquipment,
    currentItems: current.quay.placeEquipments?.shelterEquipment,
    diffItemVersions: diffShelterVersions,
    getHeading: {
      added: getAddedShelterHeading,
      updated: getUpdatedShelterHeading,
      removed: getRemovedShelterHeading,
    },
  });
}
