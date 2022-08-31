import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
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
