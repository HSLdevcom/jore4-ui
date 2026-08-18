type PendingChanges = {
  readonly conflicts: ReadonlyArray<unknown>;
  readonly stopsNeedingUpdate: ReadonlyArray<unknown>;
};

export type SaveBlockers = {
  readonly hasConflicts: boolean;
  readonly hasStopsNeedingUpdate: boolean;
};

export function getBlockers(changes: PendingChanges | null): SaveBlockers {
  if (changes === null) {
    return { hasConflicts: false, hasStopsNeedingUpdate: false };
  }

  return {
    hasConflicts: changes.conflicts.length > 0,
    hasStopsNeedingUpdate: changes.stopsNeedingUpdate.length > 0,
  };
}

export function hasBlockers(changes: PendingChanges | null): boolean {
  const blockers = getBlockers(changes);
  return blockers.hasConflicts || blockers.hasStopsNeedingUpdate;
}
