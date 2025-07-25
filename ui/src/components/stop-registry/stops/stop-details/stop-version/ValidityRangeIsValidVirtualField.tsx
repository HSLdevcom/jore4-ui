import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapToShortDate } from '../../../../../time';
import { Priority } from '../../../../../types/enums';
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

type FormInfo = {
  readonly dateRange: ISODateRange;
  readonly priority: Priority;
};

function getOverlappingValidityRange(
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  formInfo: FormInfo,
): ExistingStopValidityRange | null {
  return (
    existingValidityRanges.find((dbRange) => {
      // Higher priority items can exist simultaneously with lower prio ones.
      // They override the lower prio for the specified time period.
      if (formInfo.priority > dbRange.priority) {
        return false;
      }

      return doISODateRangesOverlap(formInfo.dateRange, {
        // start should newer be null, but DB field is nullable so ¯\_(ツ)_/¯
        start: dbRange.validity_start?.toISODate() ?? '0000-00-00',
        // Replace indefinite with "max" value to simplify comparisons.
        end: dbRange.validity_end?.toISODate() ?? '9999-99-99',
      });
    }) ?? null
  );
}

function resolveErrorMessage(
  t: TFunction,
  priority: Priority,
  validityStart: string,
  validityEnd: string | undefined,
  indefinite: boolean,
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  isEditing?: boolean,
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
    priority,
    dateRange: {
      start: validityStart,
      // Replace indefinite with "max" value to simplify comparisons.
      end: indefinite ? maxDateish : (validityEnd ?? maxDateish),
    },
  });

  // If we are editing validity range, we don't need to check for overlaps at this point
  if (overlappingRange && !isEditing) {
    return t('formValidation.stopValidityPeriodOverlap', {
      start: mapToShortDate(overlappingRange.validity_start),
      end: mapToShortDate(overlappingRange.validity_end),
    });
  }

  return null;
}

function useValidateValidityPeriod(
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  isEditing?: boolean,
) {
  const { t } = useTranslation();

  const { clearErrors, setError, watch } =
    useFormContext<StopVersionFormState>();

  const [priority, validityStart, validityEnd, indefinite] = watch([
    'priority',
    'validityStart',
    'validityEnd',
    'indefinite',
  ]);

  const validationError = useMemo(
    () =>
      resolveErrorMessage(
        t,
        priority,
        validityStart,
        validityEnd,
        indefinite,
        existingValidityRanges,
        isEditing,
      ),
    [
      t,
      priority,
      validityStart,
      validityEnd,
      indefinite,
      existingValidityRanges,
      isEditing,
    ],
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
  readonly isEditing?: boolean;
};

export const ValidityRangeIsValidVirtualField: FC<
  ValidityRangeIsValidVirtualFieldProps
> = ({ existingValidityRanges, isEditing }) => {
  useValidateValidityPeriod(existingValidityRanges, isEditing);

  return (
    <ValidationErrorList<StopVersionFormState>
      className="w-0 min-w-full"
      fieldPath="validityRangeIsValidVirtualField"
    />
  );
};
