import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import omit from 'lodash/omit';
import union from 'lodash/union';
import uniq from 'lodash/uniq';
import without from 'lodash/without';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import {
  KnownGroupedStopIds,
  KnownStopIds,
  PgIdType,
  ResultSelection,
  StopSearchHistoryState,
} from '../types';
import { useStopSearchRouterState } from './useStopSearchRouterState';

const noIds: ReadonlyArray<string> = [];

/**
 * Return a normalized ALL selected state.
 */
function selectAll(): ResultSelection {
  return {
    selectionState: 'ALL_SELECTED',
    excluded: noIds,
    included: noIds,
  };
}

/**
 * Return a normalized NONE selected state.
 */
function selectNone(): ResultSelection {
  return {
    selectionState: 'NONE_SELECTED',
    excluded: noIds,
    included: noIds,
  };
}

/**
 * Return a non-normalized PARTIAL selection state,
 * in which the given ids are included within the selection set.
 *
 * @param selection current selection state
 * @param include ids of a rows whose selection status is to be ensured to be included
 */
function includeAllInSelection(
  selection: ResultSelection,
  include: ReadonlyArray<string>,
): ResultSelection {
  if (selection.selectionState === 'ALL_SELECTED') {
    return selection;
  }

  if (selection.selectionState === 'NONE_SELECTED') {
    return {
      selectionState: 'SOME_SELECTED',
      included: uniq(include),
      excluded: noIds,
    };
  }

  if (selection.included.length) {
    return {
      selectionState: 'SOME_SELECTED',
      included: union(selection.included, include),
      excluded: noIds,
    };
  }

  return {
    selectionState: 'SOME_SELECTED',
    included: noIds,
    excluded: without(selection.excluded, ...include),
  };
}

/**
 * Return a non-normalized PARTIAL selection state,
 * in which the given ids are excluded from the selection set.
 *
 * @param selection current selection state
 * @param exclude ids of a rows whose selection status is to be ensured to be excluded
 */
function excludeAllFromSelection(
  selection: ResultSelection,
  exclude: ReadonlyArray<string>,
): ResultSelection {
  if (selection.selectionState === 'NONE_SELECTED') {
    return selection;
  }

  if (selection.selectionState === 'ALL_SELECTED') {
    return {
      selectionState: 'SOME_SELECTED',
      included: noIds,
      excluded: uniq(exclude),
    };
  }

  if (selection.excluded.length) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: union(selection.excluded, exclude),
      included: noIds,
    };
  }

  return {
    selectionState: 'SOME_SELECTED',
    excluded: noIds,
    included: without(selection.included, ...exclude),
  };
}

/**
 * Return a non-normalized PARTIAL selection state,
 * with the given id added to or removed from the exclusion list.
 *
 * @param selection current selection state
 * @param id of a row whose selection status is to be toggled
 */
function toggleExclusion(
  selection: ResultSelection,
  id: string,
): ResultSelection {
  // Selecting previously unselected row → Drop exclusion
  if (selection.excluded.includes(id)) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: without(selection.excluded, id),
      included: noIds,
    };
  }

  // Unselecting previously selected option → Add exclusion
  return {
    selectionState: 'SOME_SELECTED',
    excluded: selection.excluded.concat(id),
    included: noIds,
  };
}

/**
 * Return a non-normalized PARTIAL selection state,
 * with the given id added to or removed from the inclusion list.
 *
 * @param selection current selection state
 * @param id of a row whose selection status is to be toggled
 */
function toggleInclusion(
  selection: ResultSelection,
  id: string,
): ResultSelection {
  // Unselecting previously selected option → Drop inclusion
  if (selection.included.includes(id)) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: noIds,
      included: without(selection.included, id),
    };
  }

  // Selecting previously unselected option → Add inclusion
  return {
    selectionState: 'SOME_SELECTED',
    excluded: noIds,
    included: selection.included.concat(id),
  };
}

/**
 * Return a non-normalized PARTIAL selection state,
 * with the given id either included or excluded from the selection based on
 * its current selection status.
 *
 * @param selection current selection state
 * @param id of a row whose selection status is to be toggled
 */
function toggleSelection(
  selection: ResultSelection,
  id: string,
): ResultSelection {
  // If all were selected previously -> Toggle (add) id to excluded OR
  // If some were excluded           -> Toggle id state
  if (
    selection.selectionState === 'ALL_SELECTED' ||
    selection.excluded.length
  ) {
    return toggleExclusion(selection, id);
  }

  // Else: Either none are selected -> Toggle (add) to included OR
  // Some have been included        -> Toggle id state
  return toggleInclusion(selection, id);
}

type OptimizeSelectionInputs = {
  readonly collectedStopIds: ReadonlyArray<string>;
  readonly nextSelection: ResultSelection;
  readonly previousSelection: ResultSelection;
  readonly resultCount: number;
};

/**
 * Normalize and/or optimize the selection state for size,
 * when all rows of the full result set are known.
 *
 * If all selected, normalizes the selection state to ALL.
 * If none are selected, normalizes the selection state NONE.
 * If some are selected, optimizes the selection for size (listed ids).
 * For example if 9 out of 10 rows are selected, it is better to store a single
 * id of the non-selected row in the excluded list rather than 9 ids in the
 * included list. And if only one is selected, it is better to store the single
 * id in excluded rather than 9 in included list.
 *
 * @param collectedStopIds list of ids contained in the result set
 * @param nextSelection the new non-normalized or un-optimal selection
 *                      state from {@link toggleSelection}
 */
function optimizeAllStopsKnownSelection(
  collectedStopIds: ReadonlyArray<string>,
  nextSelection: ResultSelection,
): ResultSelection {
  const knownIncluded = intersection(nextSelection.included, collectedStopIds);
  const knownExcluded = intersection(nextSelection.excluded, collectedStopIds);

  // All known are included or no known one is excluded -> ALL are selected
  if (
    knownIncluded.length === collectedStopIds.length ||
    (nextSelection.excluded.length > 0 && knownExcluded.length === 0)
  ) {
    return selectAll();
  }
  // All known are excluded or no known one is included -> NONE are selected
  if (
    knownExcluded.length === collectedStopIds.length ||
    (nextSelection.included.length > 0 && knownIncluded.length === 0)
  ) {
    return selectNone();
  }

  // Some have been selected → Optimize for selection size
  const half = Math.floor(collectedStopIds.length / 2);
  if (knownIncluded.length > half) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: difference(collectedStopIds, knownIncluded),
      included: noIds,
    };
  }

  if (knownExcluded.length > half) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: noIds,
      included: difference(collectedStopIds, knownExcluded),
    };
  }

  // The selection is already optimal
  return nextSelection;
}

/**
 * Try to normalize and optimize the new selection.
 * See {@link optimizeAllStopsKnownSelection} for more details.
 *
 * @param collectedStopIds list if known row ids
 * @param nextSelection the new non-normalized or un-optimal selection
 * @param previousSelection previous selection state
 * @param resultCount amount of rows included in the result full result set
 */
function optimizeSelection({
  collectedStopIds,
  nextSelection,
  previousSelection,
  resultCount,
}: OptimizeSelectionInputs): ResultSelection {
  // If ALL or NONE are selected, the result is already optimal
  if (nextSelection.selectionState !== 'SOME_SELECTED') {
    return nextSelection;
  }

  // One id was included, now none is -> Select NONE
  if (previousSelection.included.length && !nextSelection.included.length) {
    return selectNone();
  }

  // One id was excluded, now none is -> Select ALL
  if (previousSelection.excluded.length && !nextSelection.excluded.length) {
    return selectAll();
  }

  // All stops are known
  if (collectedStopIds.length === resultCount) {
    return optimizeAllStopsKnownSelection(collectedStopIds, nextSelection);
  }

  // The selection already is the best we know of.
  return nextSelection;
}

type UseResultSelectionOptions = {
  // Amount of rows included in the result full result set.
  readonly resultCount: number;

  // Setter for the history state.
  readonly setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>;

  // Ids of the Stops on the current pagination page.
  readonly stopIds: ReadonlyArray<string>;
};

export type BatchUpdateSelection = (
  update: (
    previousSelection: ResultSelection,
  ) =>
    | { readonly include: ReadonlyArray<string> }
    | { readonly exclude: ReadonlyArray<string> }
    | null,
) => void;

type UseFlatResultSelectionReturn = {
  // Handler for toggling the selection status of a single row.
  readonly onToggleSelection: (id: string) => void;

  // Handled for toggling the select all/none meta checkbox.
  readonly onToggleSelectAll: () => void;
};

function updateHistoryStateWithNewSelection(
  previousState: StopSearchHistoryState,
  resultCount: number,
  nextSelection: ResultSelection,
): StopSearchHistoryState {
  const previousSelection = previousState.resultSelection;
  const collectedStopIds = previousState.knownStopIds.ids;

  const optimalSelection = optimizeSelection({
    resultCount,
    collectedStopIds,
    previousSelection,
    nextSelection,
  });

  return { ...previousState, resultSelection: optimalSelection };
}

function useOnToggleSelectionForFlatSelection({
  resultCount,
  setHistoryState,
}: UseResultSelectionOptions): (id: string) => void {
  return useCallback(
    (id: string) =>
      setHistoryState((previousState) =>
        updateHistoryStateWithNewSelection(
          previousState,
          resultCount,
          toggleSelection(previousState.resultSelection, id),
        ),
      ),
    [setHistoryState, resultCount],
  );
}

function useOnToggleSelectAll(
  setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>,
): () => void {
  return useCallback(() => {
    setHistoryState((p) => ({
      ...p,
      resultSelection:
        p.resultSelection.selectionState === 'ALL_SELECTED'
          ? selectNone()
          : selectAll(),
    }));
  }, [setHistoryState]);
}

export function useResultSelection(
  params: UseResultSelectionOptions,
): UseFlatResultSelectionReturn {
  const { stopIds, resultCount, setHistoryState } = params;

  // Register new row ids as known when the result page changes (stops updated)
  useEffect(
    () =>
      setHistoryState((p) => {
        const updatedStopIdList = uniq(p.knownStopIds.ids.concat(stopIds));

        return {
          ...p,
          resultSelection: optimizeSelection({
            resultCount,
            collectedStopIds: updatedStopIdList,
            previousSelection: p.resultSelection,
            nextSelection: p.resultSelection,
          }),
          knownStopIds: {
            listingMode: 'flat',
            ids: updatedStopIdList,
          },
        };
      }),

    [stopIds, resultCount, setHistoryState],
  );

  // Handler for toggling the selection status of a single row.
  const onToggleSelection = useOnToggleSelectionForFlatSelection(params);

  // Handler for toggling the select all/none meta checkbox.
  const onToggleSelectAll = useOnToggleSelectAll(setHistoryState);

  return { onToggleSelection, onToggleSelectAll };
}

export function assertKnownIdsListingIsGrouped(
  knownIds: KnownStopIds,
): asserts knownIds is KnownGroupedStopIds {
  if (knownIds.listingMode !== 'grouped') {
    throw new TypeError(
      'Expected knownId listing to be grouped, but it was flat listing instead!',
    );
  }
}

export function unregisterSelectionGroups(
  previousState: StopSearchHistoryState,
  ...groupIds: ReadonlyArray<PgIdType | ReadonlyArray<PgIdType>>
): StopSearchHistoryState {
  assertKnownIdsListingIsGrouped(previousState.knownStopIds);

  const previousSelection = previousState.resultSelection;

  const groups: Record<string, ReadonlyArray<string>> = omit(
    previousState.knownStopIds.groups,
    ...groupIds.flatMap(String),
  );
  const ids = uniq(Object.values(groups).flat());

  // All or nothing selected -> No need to touch selection
  if (previousSelection.selectionState !== 'SOME_SELECTED') {
    return {
      ...previousState,
      knownStopIds: { listingMode: 'grouped', ids, groups },
    };
  }

  const includedInNewList = ids.includes.bind(ids);
  const nextSelection: ResultSelection = {
    selectionState: 'SOME_SELECTED',
    excluded: previousSelection.excluded.filter(includedInNewList),
    included: previousSelection.included.filter(includedInNewList),
  };

  return {
    ...previousState,
    knownStopIds: { listingMode: 'grouped', ids, groups },
    resultSelection: optimizeSelection({
      collectedStopIds: ids,
      resultCount: ids.length,
      previousSelection,
      nextSelection,
    }),
  };
}

function makeNewIdListing(
  previousIdListing: KnownGroupedStopIds,
  groupId: string,
  stopIds: ReadonlyArray<string>,
): KnownGroupedStopIds {
  const groups = { ...previousIdListing.groups, [groupId]: stopIds };
  const ids = uniq(Object.values(groups).flat());
  return { listingMode: 'grouped', ids, groups };
}

function updateResultSelectionForUpdatedGroup(
  { excluded, included }: ResultSelection,
  previousKnownIds: KnownGroupedStopIds,
  groupId: string,
  stopIds: ReadonlyArray<string>,
): ResultSelection {
  const previousStopIds = previousKnownIds.groups[groupId] ?? [];
  const removedIds = previousStopIds.filter((id) => !stopIds.includes(id));
  const addedIds = stopIds.filter((id) => !previousStopIds.includes(id));

  const stillExists = (id: string) => !removedIds.includes(id);

  // Selection is in exclude mode -> Drop removed, and add new ones (aka, don't select them)
  if (excluded.length) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: excluded.filter(stillExists).concat(addedIds),
      included: noIds,
    };
  }

  // Selection in include mode → Drop removed.
  return {
    selectionState: 'SOME_SELECTED',
    excluded: noIds,
    included: included.filter(stillExists),
  };
}

function updateResultSelectionForGroup(
  previousSelection: ResultSelection,
  previousKnownIds: KnownGroupedStopIds,
  groupId: string,
  stopIds: ReadonlyArray<string>,
): ResultSelection {
  // All or none selected -> don't change the selection.
  if (previousSelection.selectionState !== 'SOME_SELECTED') {
    return previousSelection;
  }

  // Updating an existing group -> remove dropped and add in added if needed.
  if (groupId in previousKnownIds.groups) {
    return updateResultSelectionForUpdatedGroup(
      previousSelection,
      previousKnownIds,
      groupId,
      stopIds,
    );
  }

  // Add completely new group to exclude mode selection
  if (previousSelection.excluded.length) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: previousSelection.excluded.concat(stopIds),
      included: noIds,
    };
  }

  // Adding completely new group to include mode selection -> don't change the selection.
  // Cannot be combined to the 1st if-clause, as the 2nd clause might touch the
  // include field.
  return previousSelection;
}

function useRegisterNewGroup(
  setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>,
) {
  return useCallback(
    (groupId: PgIdType, stopIds: ReadonlyArray<string>) => {
      setHistoryState((p) => {
        const {
          resultSelection: previousSelection,
          knownStopIds: previousKnownIds,
        } = p;

        assertKnownIdsListingIsGrouped(previousKnownIds);

        const stringId = String(groupId);
        const knownStopIds = makeNewIdListing(
          previousKnownIds,
          stringId,
          stopIds,
        );

        const nextSelection = updateResultSelectionForGroup(
          previousSelection,
          previousKnownIds,
          stringId,
          stopIds,
        );

        return {
          ...p,
          knownStopIds,
          // Known id list has changed + potentially exclude list -> reoptimize
          resultSelection: optimizeSelection({
            resultCount: knownStopIds.ids.length,
            collectedStopIds: knownStopIds.ids,
            previousSelection,
            nextSelection,
          }),
        };
      });
    },
    [setHistoryState],
  );
}

function useOnToggleSelectionForGropedSelection(
  setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>,
) {
  return useCallback(
    (id: string) =>
      setHistoryState((p) =>
        updateHistoryStateWithNewSelection(
          p,
          p.knownStopIds.ids.length,
          toggleSelection(p.resultSelection, id),
        ),
      ),
    [setHistoryState],
  );
}

function useOnBatchUpdateSelection(
  setHistoryState: Dispatch<SetStateAction<StopSearchHistoryState>>,
): BatchUpdateSelection {
  return useCallback(
    (update) =>
      setHistoryState((p) => {
        const previousSelection = p.resultSelection;
        const change = update(previousSelection);

        if (!change) {
          return p;
        }

        return updateHistoryStateWithNewSelection(
          p,
          p.knownStopIds.ids.length,
          'include' in change
            ? includeAllInSelection(previousSelection, change.include)
            : excludeAllFromSelection(previousSelection, change.exclude),
        );
      }),
    [setHistoryState],
  );
}

type UseGroupedResultSelectionReturn = UseFlatResultSelectionReturn & {
  readonly onRegisterNewGroup: (
    groupId: PgIdType,
    stopIds: ReadonlyArray<string>,
  ) => void;
  readonly onBatchUpdateSelection: BatchUpdateSelection;
};

export function useGroupedResultSelection(): UseGroupedResultSelectionReturn {
  const { setHistoryState } = useStopSearchRouterState();

  const onRegisterNewGroup = useRegisterNewGroup(setHistoryState);

  // Handler for toggling the selection status of a single row.
  const onToggleSelection =
    useOnToggleSelectionForGropedSelection(setHistoryState);

  // Handler for toggling the select all/none meta checkbox.
  const onToggleSelectAll = useOnToggleSelectAll(setHistoryState);

  // Handler for ensuring inclusion status for multiple
  const onBatchUpdateSelection = useOnBatchUpdateSelection(setHistoryState);

  return {
    onRegisterNewGroup,
    onBatchUpdateSelection,
    onToggleSelection,
    onToggleSelectAll,
  };
}
