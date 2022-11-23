import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { ValidityPeriod } from '../generated/graphql';
import { mapToShortDate } from '../time';

export const mapToValidityPeriod = (
  t: TFunction,
  validityStart?: DateTime | null,
  validityEnd?: DateTime | null,
) => {
  return `${mapToShortDate(validityStart)} -  ${
    mapToShortDate(validityEnd) || t('saveChangesModal.indefinite')
  }`;
};

export const isFutureEntity = (
  observationDate: DateTime,
  entity: ValidityPeriod,
) => {
  // if entity has been valid indefinitely from the start, it can never be a future entity
  if (!entity.validity_start) {
    return false;
  }

  // otherwise its validity has to start after the observation date
  return entity.validity_start > observationDate;
};

export const isPastEntity = (
  observationDate: DateTime,
  entity: ValidityPeriod,
) => {
  // if entity is valid indefinitely, it can never be a past entity
  if (!entity.validity_end) {
    return false;
  }

  // otherwise its validity has to end before the observation date
  return entity.validity_end < observationDate;
};

export const isCurrentEntity = (
  observationDate: DateTime,
  entity: ValidityPeriod,
) => {
  return (
    !isPastEntity(observationDate, entity) &&
    !isFutureEntity(observationDate, entity)
  );
};
