import { Priority, isTemporaryPriority } from '../../../types/enums';
import { numberEnumValues } from '../../../utils';
import { VersionStatus } from './VersionStatus';

const knownPriorityNumbers: ReadonlyArray<number> = numberEnumValues(Priority);

export function parsePriority(
  prio: string | number | null | undefined,
): Priority {
  const prioNumber = Number(prio);
  return knownPriorityNumbers.includes(prioNumber)
    ? (prioNumber as Priority)
    : Priority.Standard;
}

export function mapPriorityToVersionStatus(priority: Priority): VersionStatus {
  if (priority === Priority.Draft) {
    return VersionStatus.DRAFT;
  }
  return isTemporaryPriority(priority)
    ? VersionStatus.TEMPORARY
    : VersionStatus.STANDARD;
}
