import { zodResolver } from '@hookform/resolvers/zod';
import orderBy from 'lodash/orderBy';
import range from 'lodash/range';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { commonSubstituteDayData } from '../../../../data/common_substitute_days';
import { TimetablesServiceCalendarSubstituteOperatingPeriod } from '../../../../generated/graphql';
import { useAppDispatch } from '../../../../hooks';
import { Row } from '../../../../layoutComponents';
import { setIsCommonSubstitutePeriodFormDirtyAction } from '../../../../redux/slices/timetable';
import { mapToISODate, padToTwoDigits } from '../../../../time';
import { ConfirmationDialog, SimpleButton } from '../../../../uiComponents';
import {
  mapDateTimeToFormState,
  mapLineTypes,
  parseSubstituteDayOfWeek,
  submitFormByRef,
} from '../../../../utils';
import {
  CommonDayType,
  FormState,
  schema,
} from './CommonSubstitutePeriodForm.types';
import { CommonSubstitutePeriodItem } from './CommonSubstitutePeriodItem';

const testIds = {
  cancelButton: 'CommonSubstitutePeriodForm::cancelButton',
  saveButton: 'CommonSubstitutePeriodForm::saveButton',
};

const generatePresetDates = (startDate: DateTime, endDate: DateTime) => {
  const years = range(startDate.year, endDate.year + 1);
  const generatedDates: { name: string; date: DateTime }[] = [];
  // Generate individual days for each whole year
  years.forEach((y) => {
    commonSubstituteDayData.forEach((day) => {
      generatedDates.push({
        name: day.name,
        date: DateTime.fromISO(
          `${y}-${padToTwoDigits(day.month)}-${padToTwoDigits(day.day)}`,
        ),
      });
    });
  });

  // Filter generated days that are outside of the filter period
  return generatedDates.filter((d) => d.date >= startDate && d.date <= endDate);
};

export const mapSubstituteOperatingPeriodsToFormState = (
  input: TimetablesServiceCalendarSubstituteOperatingPeriod[],
  startDate: DateTime,
  endDate: DateTime,
) => {
  const commonDays: CommonDayType[] = input?.map((item) => {
    const lineTypes: Set<string> = new Set();
    item.substitute_operating_day_by_line_types.forEach(
      (operatingDayByLineType) =>
        lineTypes.add(operatingDayByLineType.type_of_line),
    );

    return {
      periodId: item.substitute_operating_period_id,
      periodName: item.period_name,
      supersededDate: mapDateTimeToFormState(
        item.substitute_operating_day_by_line_types[0].superseded_date,
      ),
      substituteDayOfWeek: parseSubstituteDayOfWeek(
        item.substitute_operating_day_by_line_types[0].substitute_day_of_week,
      ),
      lineTypes: mapLineTypes(lineTypes),
      fromDatabase: true,
      created: false,
      isPreset: item.is_preset,
    };
  });

  const presetDates = generatePresetDates(startDate, endDate);

  // Remove dates that overlap with days from database
  const filteredDays = presetDates.filter((d) => {
    return !commonDays?.some((day) => {
      return (
        d.name === day.periodName && mapToISODate(d.date) === day.supersededDate
      );
    });
  });

  filteredDays.forEach((t) =>
    commonDays.push({
      periodName: t.name,
      supersededDate: mapDateTimeToFormState(t.date),
      lineTypes: '',
      substituteDayOfWeek: '',
      fromDatabase: false,
      created: false,
      isPreset: true,
    }),
  );

  const ordered = orderBy(commonDays, ['supersededDate'], ['asc']);
  return { commonDays: ordered };
};

export const CommonSubstitutePeriodForm = ({
  values,
  onSubmit,
}: {
  values?: FormState;
  onSubmit: (state: FormState) => void;
}): JSX.Element => {
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const formRef = useRef<ExplicitAny>(null);
  const methods = useForm<FormState>({
    values,
    resolver: zodResolver(schema),
  });
  const {
    clearErrors,
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
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

  const update = (index: number, created: boolean) => {
    // Clear errors from specific item only when "removing" it
    if (created) {
      clearErrors(`commonDays.${index}`);
    }

    setValue(`commonDays.${index}.created`, !created, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row flex-wrap">
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
