import difference from 'lodash/difference';
import union from 'lodash/union';
import without from 'lodash/without';
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { StopSearchRow } from '../../components';
import { ResultSelection, StopSearchHistoryState } from '../types';

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
  const resultCount = collectedStopIds.length;

  // All are excluded -> NONE are selected
  if (nextSelection.excluded.length === resultCount) {
    return selectNone();
  }

  // All are included -> ALL are selected
  if (nextSelection.included.length === resultCount) {
    return selectAll();
  }

  // Some have been selected → Optimize for selection size
  const half = Math.floor(resultCount / 2);
  if (nextSelection.excluded.length > half) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: noIds,
      included: difference(collectedStopIds, nextSelection.excluded),
    };
  }

  if (nextSelection.included.length > half) {
    return {
      selectionState: 'SOME_SELECTED',
      excluded: difference(collectedStopIds, nextSelection.included),
      included: noIds,
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

  // Current list of rows on the current pagination page.
  readonly stops: ReadonlyArray<StopSearchRow>;
};

type UseResultSelectionReturn = {
  // Handler for toggling the selection status of a single row.
  readonly onToggleSelection: (id: string) => void;

  // Handled for toggling the select all/none meta checkbox.
  readonly onToggleSelectAll: () => void;
};

export function useResultSelection({
  stops,
  resultCount,
  setHistoryState,
}: UseResultSelectionOptions): UseResultSelectionReturn {
  // Register new row ids as known when the result page changes (stops updated)
  useEffect(
    () =>
      setHistoryState((p) => ({
        ...p,
        knownStopIds: union(
          p.knownStopIds,
          stops.map((stop) => stop.id),
        ),
      })),
    [stops, setHistoryState],
  );

  // Handler for toggling the selection status of a single row.
  const onToggleSelection = useCallback(
    (id: string) => {
      setHistoryState((previousState) => {
        const previousSelection = previousState.resultSelection;
        const collectedStopIds = previousState.knownStopIds;

        const nextSelection = toggleSelection(previousSelection, id);
        const optimalSelection = optimizeSelection({
          resultCount,
          collectedStopIds,
          previousSelection,
          nextSelection,
        });

        return { ...previousState, resultSelection: optimalSelection };
      });
    },
    [setHistoryState, resultCount],
  );

  // Handled for toggling the select all/none meta checkbox.
  const onToggleSelectAll = useCallback(() => {
    setHistoryState((p) => ({
      ...p,
      resultSelection:
        p.resultSelection.selectionState === 'ALL_SELECTED'
          ? selectNone()
          : selectAll(),
    }));
  }, [setHistoryState]);

  return { onToggleSelection, onToggleSelectAll };
}
