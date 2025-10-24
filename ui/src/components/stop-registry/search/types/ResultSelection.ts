export const selectionStateValues = [
  'ALL_SELECTED',
  'NONE_SELECTED',
  'SOME_SELECTED',
] as const;

export type SelectionState = (typeof selectionStateValues)[number];

/**
 * Represents the selected rows on the Stop Search page / on the map.
 *
 * ### Can be in 3(4) different states:
 * 1. `selectionState` = __ALL__: All rows are selected.
 * 2. `selectionState` = __NONE__: None of the rows are selected.
 * 3. `selectionState` = __PARTIAL__: Some of the rows are selected.
 *
 * ### Partial selections
 * Technically partial selections could also represent all and none selected
 * states: all excluded (none selected) or all included (all selected).
 * But those should be normalized to use the proper `selectionState` ALL and
 * NONE values.
 *
 * In a simpler situation we could just use a simple array of ids,
 * to represent the selected rows, but because the result set has true paging,
 * by default we never know what "all selected" actually means.
 *
 * If we start from the _ALL_ selected state, and toggle one the rows,
 * we now know of a single row that is _NOT_ selected (added to excluded list).
 * If the same row is then toggled again, we simply remove it from the exclusion
 * list. And if we start from the _NONE_ selected state, toggling a single row
 * tells us of a single row that is to be included in the selection, while no
 * other row is included, no matter the data page they are on.
 *
 */
export type ResultSelection = {
  readonly selectionState: SelectionState;
  readonly included: ReadonlyArray<string>;
  readonly excluded: ReadonlyArray<string>;
};

export const defaultResultSelection: ResultSelection = {
  selectionState: 'ALL_SELECTED',
  included: [],
  excluded: [],
};
