import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { ValidityPeriod } from '../generated/graphql';
import { mapToShortDate } from '../time';

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
