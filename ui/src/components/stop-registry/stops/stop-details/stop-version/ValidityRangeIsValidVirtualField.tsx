import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../time';
import { ValidationErrorList } from '../../../../forms/common';
import { ExistingStopValidityRange, StopVersionFormState } from './types';

// ISO date strings can be compared as strings.
// This value is used to represent indefinite end-date cases.
const maxDateish = '9999-99-99';

type ISODateRange = {
  readonly start: string;
  readonly end: string;
};

function doISODateRangesOverlap(
  rangeA: ISODateRange,
  rangeB: ISODateRange,
): boolean {
  const aIsBeforeB = rangeA.start < rangeB.start && rangeA.end < rangeB.start;
  const aIsAfterB = rangeA.start > rangeB.end && rangeA.end > rangeB.end;

  return !(aIsBeforeB || aIsAfterB);
}

function getOverlappingValidityRange(
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  formRange: ISODateRange,
): ExistingStopValidityRange | null {
  return (
    existingValidityRanges.find((dbRange) =>
      doISODateRangesOverlap(formRange, {
        // start should newer be null, but DB field is nullable so ¯\_(ツ)_/¯
        start: dbRange.validity_start?.toISODate() ?? '0000-00-00',
        // Replace indefinite with "max" value to simplify comparisons.
        end: dbRange.validity_end?.toISODate() ?? '9999-99-99',
      }),
    ) ?? null
  );
}

function resolveErrorMessage(
  t: TFunction,
  validityStart: string,
  validityEnd: string | undefined,
  indefinite: boolean,
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
): string | null {
  // If end is before start
  if (validityStart && !indefinite && validityEnd) {
    if (validityStart > validityEnd) {
      return t('formValidation.timeRange');
    }
  }

  // If start is before today
  const today = DateTime.now().startOf('day').toISODate();
  if (validityStart < today) {
    return t('formValidation.validityDateRangeInPast');
  }

  // If end date or indefinite not set yet.
  if (!indefinite && !validityEnd) {
    return t('formValidation.stopValidityEndNotDefined');
  }

  const overlappingRange = getOverlappingValidityRange(existingValidityRanges, {
    start: validityStart,
    // Replace indefinite with "max" value to simplify comparisons.
    end: indefinite ? maxDateish : (validityEnd ?? maxDateish),
  });

  if (overlappingRange) {
    return t('formValidation.stopValidityPeriodOverlap', {
      start: mapToShortDate(overlappingRange.validity_start),
      end: mapToShortDate(overlappingRange.validity_end),
    });
  }

  return null;
}

function useValidateValidityPeriod(
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
) {
  const { t } = useTranslation();

  const { clearErrors, setError, watch } =
    useFormContext<StopVersionFormState>();

  const [validityStart, validityEnd, indefinite] = watch([
    'validityStart',
    'validityEnd',
    'indefinite',
  ]);

  const validationError = useMemo(
    () =>
      resolveErrorMessage(
        t,
        validityStart,
        validityEnd,
        indefinite,
        existingValidityRanges,
      ),
    [t, validityStart, validityEnd, indefinite, existingValidityRanges],
  );

  useEffect(() => {
    if (validationError) {
      setError('validityRangeIsValidVirtualField', {
        type: 'custom',
        message: validationError,
      });
    } else {
      clearErrors('validityRangeIsValidVirtualField');
    }
  }, [validationError, clearErrors, setError]);
}

type ValidityRangeIsValidVirtualFieldProps = {
  readonly existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>;
};

export const ValidityRangeIsValidVirtualField: FC<
  ValidityRangeIsValidVirtualFieldProps
> = ({ existingValidityRanges }) => {
  useValidateValidityPeriod(existingValidityRanges);

  return (
    <ValidationErrorList<StopVersionFormState>
      className="w-0 min-w-full"
      fieldPath="validityRangeIsValidVirtualField"
    />
  );
};
