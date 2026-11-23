import { TFunction } from 'i18next';
import { FC, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Priority } from '../../../../../types/enums';
import {
  getValidityContainmentViolation,
  mapToValidityPeriod,
} from '../../../../../utils';
import {
  today as getToday,
  mapToShortDate,
  parseDate,
} from '../../../../../utils/time';
import { ValidationErrorList } from '../../../../common/Inputs';
import { ExistingStopValidityRange, StopVersionFormState } from './Types';

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

export type StopAreaValidity = {
  readonly validityStart?: string | null;
  readonly validityEnd?: string | null;
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
        start: dbRange.validity_start?.toString() ?? '0000-00-00',
        // Replace indefinite with "max" value to simplify comparisons.
        end: dbRange.validity_end?.toString() ?? '9999-99-99',
      });
    }) ?? null
  );
}

export function resolveErrorMessage(
  t: TFunction,
  priority: Priority,
  validityStart: string,
  validityEnd: string | undefined,
  indefinite: boolean,
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  validityEndTouched: boolean,
  isEditing?: boolean,
  stopAreaValidity?: StopAreaValidity | null,
): string | null {
  // If end is before start
  if (validityStart && !indefinite && validityEnd) {
    if (validityStart > validityEnd) {
      return t(($) => $.formValidation.timeRange);
    }
  }

  // If start is before today
  const today = getToday().toString();
  if (validityStart < today) {
    return t(($) => $.formValidation.validityDateRangeInPast);
  }

  // If end date or indefinite not set yet.
  if (!indefinite && !validityEnd) {
    return validityEndTouched
      ? t(($) => $.formValidation.stopValidityEndNotDefined)
      : null;
  }

  if (
    stopAreaValidity?.validityStart &&
    getValidityContainmentViolation(
      {
        validity_start: parseDate(validityStart),
        validity_end: indefinite ? null : parseDate(validityEnd),
      },
      {
        validity_start: parseDate(stopAreaValidity.validityStart),
        validity_end: parseDate(stopAreaValidity.validityEnd),
      },
    )
  ) {
    return t(($) => $.stops.stopAreaValidityNotEnough, {
      validity: mapToValidityPeriod(
        t,
        parseDate(stopAreaValidity.validityStart),
        parseDate(stopAreaValidity.validityEnd),
      ),
    });
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
    return t(($) => $.formValidation.stopValidityPeriodOverlap, {
      start: mapToShortDate(overlappingRange.validity_start),
      end: mapToShortDate(overlappingRange.validity_end),
    });
  }

  return null;
}

function useValidateValidityPeriod(
  existingValidityRanges: ReadonlyArray<ExistingStopValidityRange>,
  isEditing?: boolean,
  stopAreaValidity?: StopAreaValidity | null,
) {
  const { t } = useTranslation();

  const { clearErrors, setError, watch, formState } =
    useFormContext<StopVersionFormState>();

  const validityEndTouched =
    formState.isSubmitted ||
    !!formState.touchedFields.validityEnd ||
    !!formState.touchedFields.indefinite ||
    !!formState.dirtyFields.indefinite;

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
        validityEndTouched,
        isEditing,
        stopAreaValidity,
      ),
    [
      t,
      priority,
      validityStart,
      validityEnd,
      indefinite,
      existingValidityRanges,
      validityEndTouched,
      isEditing,
      stopAreaValidity,
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
  readonly stopAreaValidity?: StopAreaValidity | null;
};

export const ValidityRangeIsValidVirtualField: FC<
  ValidityRangeIsValidVirtualFieldProps
> = ({ existingValidityRanges, isEditing, stopAreaValidity }) => {
  useValidateValidityPeriod(
    existingValidityRanges,
    isEditing,
    stopAreaValidity,
  );

  return (
    <ValidationErrorList<StopVersionFormState>
      className="w-0 min-w-full"
      fieldPath="validityRangeIsValidVirtualField"
    />
  );
};
