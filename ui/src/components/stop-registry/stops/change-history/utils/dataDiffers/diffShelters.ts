import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { notNullish } from '../../../../../../utils';
import { ChangedValue } from '../../../../../common/ChangeHistory';
import { HistoricalStopData } from '../../types';

export function diffShelters(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const previousShelters = compact(
    previous.quay.placeEquipments?.shelterEquipment,
  );
  const currentShelters = compact(
    current.quay.placeEquipments?.shelterEquipment,
  );

  const previousShelterIds = previousShelters.map((shelter) => shelter.id);
  const currentShelterIds = currentShelters.map((shelter) => shelter.id);

  const sharedSheltersIds = previousShelterIds.filter((id) =>
    currentShelterIds.includes(id),
  );
  const removedShelterIds = previousShelterIds.filter(
    (id) => !sharedSheltersIds.includes(id),
  );
  const addedShelterIds = currentShelterIds.filter(
    (id) => !sharedSheltersIds.includes(id),
  );

  const addedShelterChangedValues: Array<ChangedValue> = addedShelterIds
    .map((addedShelterId) =>
      currentShelters.find((it) => it.id === addedShelterId),
    )
    .filter(notNullish)
    .flatMap((shelter) => {
      const { id } = shelter;

      return [
        {
          key: `${id}:added`,
          field: null,
          oldValue: null,
          newValue: t('stopChangeHistory.shelters.added'),
        },
      ];
    });

  return [];
}
