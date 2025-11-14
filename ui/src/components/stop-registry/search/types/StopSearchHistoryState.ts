import { ResultSelection } from './ResultSelection';

export type KnownFlatStopIds = {
  readonly listingMode: 'flat';
  // We only need a single flat list of ids.
  readonly ids: ReadonlyArray<string>;
};

export type KnownGroupedStopIds = {
  readonly listingMode: 'grouped';

  // Include a precalculated flat list of the ids in addition to the group
  // mapping, needed to unregister the id's as the groups get unselected.
  readonly ids: ReadonlyArray<string>;
  readonly groups: Readonly<Record<string, ReadonlyArray<string>>>;
};

export type KnownStopIds = KnownFlatStopIds | KnownGroupedStopIds;

export type StopSearchHistoryState = {
  readonly searchIsExpanded: boolean;
  readonly selectedGroups: ReadonlyArray<string>;
  readonly resultSelection: ResultSelection;
  readonly knownStopIds: KnownStopIds;
};
