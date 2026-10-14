import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { RouteDirectionEnum, ValidityPeriod } from '../generated/graphql';
import { DateLike, mapToShortDate, parseDate } from '../time';
import { Priority } from '../types/enums';

export function mapToValidityPeriod(
  t: TFunction,
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) {
  const indefinite = t(($) => $.saveChangesModal.indefinite);

  return `${mapToShortDate(validityStart) ?? indefinite} -  ${
    mapToShortDate(validityEnd) ?? indefinite
  }`;
}

type ValidityPeriodBounds = {
  readonly validity_start?: DateTime | null;
  readonly validity_end?: DateTime | null;
};

export type ValidityContainmentViolation =
  'startBeforeParent' | 'endAfterParent';

/**
 * Check whether the `child` validity period fits fully inside the `parent`
 * validity period. An indefinite (null) start or end on the parent means the
 * period is unbounded in that direction.
 */
export function getValidityContainmentViolation(
  child: ValidityPeriodBounds,
  parent: ValidityPeriodBounds,
): ValidityContainmentViolation | null {
  if (
    !child.validity_start ||
    (parent.validity_start && child.validity_start < parent.validity_start)
  ) {
    return 'startBeforeParent';
  }

  const parentValidityEnd = parent.validity_end?.endOf('day');

  if (
    parentValidityEnd &&
    (!child.validity_end || child.validity_end > parentValidityEnd)
  ) {
    return 'endAfterParent';
  }

  return null;
}

/**
 * Check if given `entity`'s validity starts in the future at given `observationDate`
 * @param observationDate Date related to which entity validity is checked
 * @param entity Object with validity period, e.g. stop, line or route
 * @returns True if `entity`'s validity start is in the future
 */
export function isFutureEntity(
  observationDate: DateTime,
  entity: ValidityPeriod,
) {
  // if entity has been valid indefinitely from the start, it can never be a future entity
  if (!entity.validity_start) {
    return false;
  }

  // otherwise its validity has to start after the observation date
  return entity.validity_start > observationDate;
}

/**
 * Check if given `entity`'s validity has already ended at given `observationDate`
 * @param observationDate Date related to which entity validity is checked
 * @param entity Object with validity period, e.g. stop, line or route
 * @returns True if `entity`'s validity end is in the past
 */
export function isPastEntity(
  observationDate: DateTime,
  entity: ValidityPeriod,
) {
  // if entity is valid indefinitely, it can never be a past entity
  if (!entity.validity_end) {
    return false;
  }

  // otherwise its validity has to end before the observation date
  return entity.validity_end < observationDate;
}

/**
 * Check if given `entity` is valid at the given `observationDate`
 * @param observationDate Date related to which entity validity is checked
 * @param entity Object with validity period, e.g. stop, line or route
 * @returns True if `entity` is valid at the given `observationDate`
 */
export function isCurrentEntity(
  observationDate: DateTime,
  entity: ValidityPeriod,
) {
  return (
    !isPastEntity(observationDate, entity) &&
    !isFutureEntity(observationDate, entity)
  );
}

// True if validityEnd is in the future, but less than 20 days away.
export function isEndingSoon(validityEnd: DateLike | null | undefined) {
  const end = parseDate(validityEnd);
  const now = DateTime.now();
  return !!end && end > now && end < now.plus({ days: 20 });
}

export type VersionedEntity = {
  readonly priority: number;
  readonly validity_start?: DateLike | null;
  readonly validity_end?: DateLike | null;
};

export type RouteVersionKey = {
  readonly label: string;
  readonly direction: RouteDirectionEnum;
  readonly variant?: number | null;
};

export function isVersionOfSameRoute(
  route: RouteVersionKey,
  other: RouteVersionKey,
) {
  return (
    route.label === other.label &&
    route.direction === other.direction &&
    (route.variant ?? null) === (other.variant ?? null)
  );
}

/**
 * Check if some other version takes over when given `version`'s validity ends,
 * i.e. if the version is replaced by a continuing one. Drafts are not taken
 * into account, as they are not actually in use.
 * @param version Version whose continuity is checked
 * @param versions All versions of the same entity, e.g. all versions of a stop
 * label. May also contain `version` itself.
 * @returns True if a non-draft version is valid right after `version`'s validity ends
 */
export function hasContinuingVersion(
  version: VersionedEntity,
  versions: ReadonlyArray<VersionedEntity>,
) {
  const validityEnd = parseDate(version.validity_end);

  // Validity never ends, so there is nothing to continue.
  if (!validityEnd) {
    return false;
  }

  return versions.some((other) => {
    if (other.priority === Priority.Draft) {
      return false;
    }

    // The other version has to be valid for longer than this one.
    const otherEnd = parseDate(other.validity_end);
    if (otherEnd && otherEnd <= validityEnd) {
      return false;
    }

    // ...and it has to start at latest on the day after this one ends.
    const otherStart = parseDate(other.validity_start);
    return !otherStart || otherStart <= validityEnd.plus({ days: 1 });
  });
}
