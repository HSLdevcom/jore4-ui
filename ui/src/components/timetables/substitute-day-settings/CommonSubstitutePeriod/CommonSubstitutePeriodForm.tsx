import { zodResolver } from '@hookform/resolvers/zod';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { DateTime } from 'luxon';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SubstituteOperatingPeriodSettingsInfoFragment } from '../../../../generated/graphql';
import { useAppDispatch } from '../../../../hooks';
import { Row } from '../../../../layoutComponents';
import { setIsCommonSubstitutePeriodFormDirtyAction } from '../../../../redux/slices/timetable';
import { mapToISODate, padToTwoDigits } from '../../../../time';
import { DateRange } from '../../../../types';
import { ConfirmationDialog, SimpleButton } from '../../../../uiComponents';
import {
  mapDateTimeToFormState,
  mapLineTypes,
  parseSubstituteDayOfWeek,
  submitFormByRef,
} from '../../../../utils';
import { useDirtyFormBlockNavigation } from '../../../forms/common/NavigationBlocker';
import { commonSubstituteDayData } from '../common_substitute_day_data';
import {
  CommonDayType,
  FormState,
  UpdateField,
  schema,
} from './CommonSubstitutePeriodForm.types';
import { CommonSubstitutePeriodItem } from './CommonSubstitutePeriodItem';

const testIds = {
  cancelButton: 'CommonSubstitutePeriodForm::cancelButton',
  saveButton: 'CommonSubstitutePeriodForm::saveButton',
};

type GeneratedDate = { name: string; date: DateTime };

const generatePresetDatesForDateRange = (
  startDate: DateTime,
  endDate: DateTime,
) => {
  const years = range(startDate.year, endDate.year + 1);
  const generatedDates: GeneratedDate[] = [];

  // Generate individual days for each year
  // return generated dates within date range
  years.forEach((year) => {
    commonSubstituteDayData.forEach((day) => {
      const date = DateTime.fromISO(
        `${year}-${padToTwoDigits(day.month)}-${padToTwoDigits(day.day)}`,
      );
      if (date >= startDate && date <= endDate) {
        generatedDates.push({
          name: `${day.name} ${year}`,
          date,
        });
      }
    });
  });

  return generatedDates;
};

export const mapCommonSubstituteOperatingPeriodsToCommonDays = (
  commonSubstituteOperatingPeriods: ReadonlyArray<SubstituteOperatingPeriodSettingsInfoFragment>,
): CommonDayType[] => {
  return commonSubstituteOperatingPeriods?.map((period) => {
    const lineTypes: Set<string> = new Set();
    period.substitute_operating_day_by_line_types.forEach(
      (operatingDayByLineType) =>
        lineTypes.add(operatingDayByLineType.type_of_line),
    );

    return {
      periodId: period.substitute_operating_period_id,
      periodName: period.period_name,
      supersededDate: mapDateTimeToFormState(
        period.substitute_operating_day_by_line_types[0].superseded_date,
      ),
      substituteDayOfWeek: parseSubstituteDayOfWeek(
        period.substitute_operating_day_by_line_types[0].substitute_day_of_week,
      ),
      lineTypes: mapLineTypes(lineTypes),
      fromDatabase: true,
      created: false,
      isPreset: period.is_preset,
    };
  });
};

const combineCommonDaysWithPresetDates = (
  commonDays: ReadonlyArray<CommonDayType>,
  presetDays: ReadonlyArray<GeneratedDate>,
): ReadonlyArray<CommonDayType> => {
  const displayedCommonDays = [...commonDays];

  presetDays.forEach((presetDay) => {
    const presetDayFoundInCommonDays = commonDays.some(
      (commonDay) =>
        presetDay.name === commonDay.periodName &&
        mapToISODate(presetDay.date) === commonDay.supersededDate,
    );

    if (!presetDayFoundInCommonDays) {
      displayedCommonDays.push({
        periodName: presetDay.name,
        supersededDate: mapDateTimeToFormState(presetDay.date),
        lineTypes: '',
        substituteDayOfWeek: '',
        fromDatabase: false,
        created: false,
        isPreset: true,
      });
    }
  });

  return displayedCommonDays;
};

type CommonSubstitutePeriodFormProps = {
  readonly className?: string;
  readonly commonDays?: ReadonlyArray<CommonDayType>;
  readonly onSubmit: (state: FormState) => void;
  readonly dateRange: DateRange;
};

export const CommonSubstitutePeriodForm: FC<
  CommonSubstitutePeriodFormProps
> = ({
  className,
  commonDays,
  onSubmit,
  dateRange: { startDate, endDate },
}) => {
  const { t } = useTranslation();
  const formRef = useRef<ExplicitAny>(null);
  const dispatch = useAppDispatch();

  const [isResetting, setIsResetting] = useState<boolean>(false);

  const generatedPresetDates = useMemo(
    () => generatePresetDatesForDateRange(startDate, endDate),
    [startDate, endDate],
  );

  const orderedDisplayedCommonDays = useMemo(() => {
    const displayedCommonDays = combineCommonDaysWithPresetDates(
      commonDays ?? [],
      generatedPresetDates,
    );

    return orderBy(displayedCommonDays, ['supersededDate'], ['asc']);
  }, [generatedPresetDates, commonDays]);

  const methods = useForm<FormState>({
    values: { commonDays: orderedDisplayedCommonDays },
    resolver: zodResolver(schema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'CommonSubstitutePeriodForm');

  const {
    clearErrors,
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
    resetField,
    setValue,
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'commonDays',
  });

  const onReset = () => {
    setIsResetting(false);
    reset();
  };

  const onSave = () => {
    submitFormByRef(formRef);
  };

  useEffect(() => {
    dispatch(setIsCommonSubstitutePeriodFormDirtyAction(isDirty));
  }, [dispatch, isDirty]);

  const update = (index: number, value: boolean, field: UpdateField) => {
    // Clear errors from specific item only when "removing" it
    if (value) {
      clearErrors(`commonDays.${index}`);
    }

    if (!value) {
      setValue(`commonDays.${index}.${field}`, true, {
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      resetField(`commonDays.${index}`);
    }
  };

  return (
    <div className={className}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap justify-between gap-8">
            {fields.map((field, index) => (
              <CommonSubstitutePeriodItem
                field={field}
                index={index}
                key={field.id}
                update={update}
              />
            ))}
          </div>
          <Row className="my-8 justify-end space-x-4">
            <SimpleButton
              onClick={() => setIsResetting(true)}
              disabled={!isDirty}
              id="cancel-button"
              testId={testIds.cancelButton}
              inverted
            >
              {t('cancel')}
            </SimpleButton>

            <SimpleButton
              onClick={onSave}
              disabled={!isDirty}
              id="save-button"
              testId={testIds.saveButton}
            >
              {t('save')}
            </SimpleButton>
          </Row>
        </form>
      </FormProvider>
      <ConfirmationDialog
        isOpen={isResetting}
        onCancel={() => setIsResetting(false)}
        onConfirm={onReset}
        title={t('confirmResetCommonSubstitutePeriodDialog.title')}
        description={t('confirmResetCommonSubstitutePeriodDialog.description')}
        confirmText={t('confirmResetCommonSubstitutePeriodDialog.confirmText')}
        cancelText={t('confirmResetCommonSubstitutePeriodDialog.cancelText')}
      />
    </div>
  );
};
