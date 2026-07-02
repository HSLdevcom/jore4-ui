import { Priority } from '../../../types/enums';
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
  switch (priority) {
    case Priority.Draft:
      return VersionStatus.DRAFT;
    case Priority.Temporary:
      return VersionStatus.TEMPORARY;
    default:
      return VersionStatus.STANDARD;
  }
}
