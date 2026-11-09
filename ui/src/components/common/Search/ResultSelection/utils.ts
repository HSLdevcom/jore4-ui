import { TypedRouterHistoryStateShapeError } from '../../Utils/typedRouterState';
import {
  KnownIds,
  ResultSelection,
  SelectionState,
  selectionStateValues,
} from './ResultSelection';

export function assertIsAnArrayOfStrings(
  path: string,
  value: unknown,
): asserts value is Array<string> {
  if (!Array.isArray(value)) {
    throw new TypedRouterHistoryStateShapeError(
      path,
      value,
      `Expected an array of strings for useStopSearchRouterState's history state's ${path} field, but value was (${String(value)})!`,
    );
  }

  for (let i = 0; i < value.length; i += 1) {
    const item = value[i];
    if (typeof item !== 'string') {
      throw new TypedRouterHistoryStateShapeError(
        `${path}[${i}]`,
        item,
        `Expected an array strings for useStopSearchRouterState's history state's ${path} field, but the array contained item (${String(item)})!`,
      );
    }
  }
}

export function assertIsAResultSelection(
  path: string,
  value: unknown,
): asserts value is ResultSelection {
  if (typeof value !== 'object' || value === null) {
    throw new TypedRouterHistoryStateShapeError(
      path,
      value,
      `Expected ResultSelection for useStopSearchRouterState's history state's ${path} field, but value was (${String(value)})!`,
    );
  }

  const { selectionState, included, excluded } = value as Record<
    string,
    unknown
  >;

  if (!selectionStateValues.includes(selectionState as SelectionState)) {
    throw new TypedRouterHistoryStateShapeError(
      `${path}.selectionState`,
      selectionState,
      `Expected ResultSelection for useStopSearchRouterState's history state's ${path} field, but it's selectionState is (${String(selectionState)})!`,
    );
  }

  assertIsAnArrayOfStrings(`${path}.included`, included);
  assertIsAnArrayOfStrings(`${path}.excluded`, excluded);
}

export function assertIsAKnownIds(
  path: string,
  value: unknown,
): asserts value is KnownIds {
  if (typeof value !== 'object' || !value) {
    throw new TypedRouterHistoryStateShapeError(
      path,
      value,
      `Expected simple object value for useStopSearchRouterState's history state's knownStopIds field, but value was (${String(value)})!`,
    );
  }

  const record = value as Record<string, unknown>;
  assertIsAnArrayOfStrings(`${path}.ids`, record.ids);

  if (record.listingMode === 'flat') {
    return;
  }

  if (record.listingMode !== 'grouped') {
    throw new TypedRouterHistoryStateShapeError(
      `${path}.listingMode`,
      record.listingMode,
      `Expected 'listingMode' field of KnownStopIds to be either 'flat' or 'grouped', but value was (${String(record.listingMode)})!`,
    );
  }

  if (typeof record.groups !== 'object' || !record.groups) {
    throw new TypedRouterHistoryStateShapeError(
      `${path}.groups`,
      record.groups,
      `Expected 'groups' field of KnownStopIds to be a simple object, but value was (${String(record.groups)})!`,
    );
  }

  const groups = Object.entries(record.groups);
  for (let i = 0; i < groups.length; i += 1) {
    const [key, group] = groups[i];
    assertIsAnArrayOfStrings(`${path}.groups.${key}`, group);
  }
}
