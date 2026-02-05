import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import intersection from 'lodash/intersection';
import without from 'lodash/without';
import { notNullish } from '../../../../../../utils';
import {
  ChangedValue,
  EmptyCell,
  KeyedChangedValue,
} from '../../../../../common/ChangeHistory';

type HasTiamatTypedID = { readonly id?: string | null | undefined };

type ChangeValueSet = {
  readonly heading: ChangedValue;
  readonly fields: ReadonlyArray<ChangedValue>;
};

type UncleanItems<ItemT> = ReadonlyArray<ItemT | null | undefined>;

type GetHeading<ItemT> = {
  readonly added: (t: TFunction, added: ItemT) => ChangedValue;
  readonly updated: (
    t: TFunction,
    previous: ItemT,
    current: ItemT,
  ) => ChangedValue;
  readonly removed: (t: TFunction, removed: ItemT) => ChangedValue;
};

type DiffItemVersionsFn<ItemT> = (
  t: TFunction,
  previousVersion: ItemT | null,
  currentVersion: ItemT | null,
) => ReadonlyArray<KeyedChangedValue>;

type DiffNestedItemsOptions<ItemT> = {
  readonly t: TFunction;

  readonly previousItems: UncleanItems<ItemT> | null | undefined;

  readonly currentItems: UncleanItems<ItemT> | null | undefined;

  readonly diffItemVersions: DiffItemVersionsFn<ItemT>;

  readonly getHeading: GetHeading<ItemT>;
};

function addedItemsToChangedValueSets<ItemT extends HasTiamatTypedID>(
  t: TFunction,
  getHeading: GetHeading<ItemT>,
  diffItemVersions: DiffItemVersionsFn<ItemT>,
  currentItems: ReadonlyArray<ItemT>,
  addedIds: ReadonlyArray<string>,
): Array<ChangeValueSet> {
  return addedIds
    .map((id) => currentItems.find((item) => item.id === id))
    .filter(notNullish)
    .map(
      (item): ChangeValueSet => ({
        heading: getHeading.added(t, item),
        fields: diffItemVersions(t, null, item).map((field) => ({
          ...field,
          key: `${item.id}::${field.key}`,
          oldValue: <EmptyCell />,
        })),
      }),
    );
}

function updatedItemsToChangedValueSets<ItemT extends HasTiamatTypedID>(
  t: TFunction,
  getHeading: GetHeading<ItemT>,
  diffItemVersions: DiffItemVersionsFn<ItemT>,
  previousItems: ReadonlyArray<ItemT>,
  currentItems: ReadonlyArray<ItemT>,
  sharedIds: ReadonlyArray<string>,
): Array<ChangeValueSet> {
  return sharedIds
    .map((id) => {
      const previousVersion = previousItems.find((item) => item.id === id);
      const currentVersion = currentItems.find((item) => item.id === id);

      if (!previousVersion || !currentVersion) {
        return null;
      }

      return { previousVersion, currentVersion };
    })
    .filter(notNullish)
    .map(({ previousVersion, currentVersion }) => ({
      heading: getHeading.updated(t, previousVersion, currentVersion),
      fields: diffItemVersions(t, previousVersion, currentVersion).map(
        (field) => ({
          ...field,
          key: `${previousVersion.id}::${field.key}`,
        }),
      ),
    }));
}

function removedItemsToChangedValueSets<ItemT extends HasTiamatTypedID>(
  t: TFunction,
  getHeading: GetHeading<ItemT>,
  diffItemVersions: DiffItemVersionsFn<ItemT>,
  previousItems: ReadonlyArray<ItemT>,
  removedIds: ReadonlyArray<string>,
): Array<ChangeValueSet> {
  return removedIds
    .map((id) => previousItems.find((item) => item.id === id))
    .filter(notNullish)
    .map(
      (item): ChangeValueSet => ({
        heading: getHeading.removed(t, item),
        fields: diffItemVersions(t, item, null).map((field) => ({
          ...field,
          key: `${item.id}::${field.key}`,
          newValue: <EmptyCell />,
        })),
      }),
    );
}

export function diffNestedItems<ItemT extends HasTiamatTypedID>({
  t,
  previousItems: uncleanPreviousItems,
  currentItems: uncleanCurrentItems,
  diffItemVersions,
  getHeading,
}: DiffNestedItemsOptions<ItemT>): Array<ChangedValue> {
  const previousItems = compact(uncleanPreviousItems);
  const previousIds = compact(previousItems.map((item) => item.id));

  const currentItems = compact(uncleanCurrentItems);
  const currentIds = compact(currentItems.map((item) => item.id));

  const sharedIds = intersection(previousIds, currentIds);

  const addedItemChangeSets = addedItemsToChangedValueSets(
    t,
    getHeading,
    diffItemVersions,
    currentItems,
    without(currentIds, ...previousIds),
  );

  const updatedItemChangeSets = updatedItemsToChangedValueSets(
    t,
    getHeading,
    diffItemVersions,
    previousItems,
    currentItems,
    sharedIds,
  );

  const removedItemChangeSets = removedItemsToChangedValueSets(
    t,
    getHeading,
    diffItemVersions,
    previousItems,
    without(previousIds, ...currentIds),
  );

  return [
    ...addedItemChangeSets,
    ...updatedItemChangeSets,
    ...removedItemChangeSets,
  ]
    .filter((changeSet) => changeSet.fields.length > 0)
    .flatMap((changeSet) => [changeSet.heading, ...changeSet.fields]);
}
