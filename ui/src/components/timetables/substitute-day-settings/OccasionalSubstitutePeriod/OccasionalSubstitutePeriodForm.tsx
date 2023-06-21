import { zodResolver } from '@hookform/resolvers/zod';
import noop from 'lodash/noop';
import { DateTime, Duration } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import {
  Maybe,
  RouteTypeOfLineEnum,
  TimetablesServiceCalendarSubstituteOperatingPeriod,
} from '../../../../generated/graphql';
import { useAppDispatch } from '../../../../hooks';
import { Row } from '../../../../layoutComponents';
import { setIsOccasionalSubstitutePeriodFormDirtyAction } from '../../../../redux/slices/timetable';
import { mapDurationToShortTime, mapToISODate } from '../../../../time';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import { ConfirmationDialog, SimpleButton } from '../../../../uiComponents';
import { AllOptionEnum, submitFormByRef } from '../../../../utils';
import {
  FormState,
  PeriodType,
  schema,
} from './OccasionalSubstitutePeriodForm.types';
import { OccasionalSubstitutePeriodRow } from './OccasionalSubstitutePeriodRow';

const testIds = {
  cancelButton: 'RandomReferenceDayForm::cancelButton',
  saveButton: 'RandomReferenceDayForm::saveButton',
  addRowButton: 'RandomReferenceDayForm::addRowButton',
};

const generateLineTypes = (): string => {
  const val: string[] = Object.values(RouteTypeOfLineEnum);
  val.push(AllOptionEnum.All);
  return val.join(',');
};

const emptyRowObject: PeriodType = {
  periodName: '',
  lineTypes: generateLineTypes(),
  substituteDayOfWeek: SubstituteDayOfWeek.NoTraffic,
  beginDate: mapToISODate(DateTime.now()) ?? '',
  endDate: mapToISODate(DateTime.now()) ?? '',
  beginTime: '04:30',
  endTime: '28:30',
};

const mapDateTimeToFormState = (date: Maybe<DateTime> | undefined): string => {
  const stringDate = date ? mapToISODate(date) : mapToISODate(DateTime.now());
  return stringDate ?? '';
};

const mapDurationToString = (duration: Maybe<Duration> | undefined) => {
  if (duration) {
    return mapDurationToShortTime(duration);
  }
  return '';
};

const mapSubstituteDayOfWeek = (
  substituteDayOfWeek: Maybe<number> | undefined,
) => {
  if (substituteDayOfWeek) {
    return Object.values(SubstituteDayOfWeek)[substituteDayOfWeek];
  }
  return SubstituteDayOfWeek.NoTraffic;
};

const mapLineTypes = (lineTypes: Set<string>) => {
  if (lineTypes.size === Object.keys(RouteTypeOfLineEnum).length) {
    lineTypes.add(AllOptionEnum.All);
  }
  return Array.from(lineTypes).join(',');
};
const convertToPeriodSchema = (
  input: TimetablesServiceCalendarSubstituteOperatingPeriod[],
): FormState => {
  const periods = input?.map((item) => {
    const periodBeginDate = item.substitute_operating_day_by_line_types.reduce(
      (minDate, lineType) =>
        lineType.superseded_date < minDate ? lineType.superseded_date : minDate,
      item.substitute_operating_day_by_line_types[0].superseded_date,
    );

    const periodEndDate = item.substitute_operating_day_by_line_types.reduce(
      (maxDate, lineType) =>
        lineType.superseded_date > maxDate ? lineType.superseded_date : maxDate,
      item.substitute_operating_day_by_line_types[0].superseded_date,
    );
    const lineTypes: Set<string> = new Set();
    item.substitute_operating_day_by_line_types.forEach(
      (operatingDayByLineType) =>
        lineTypes.add(operatingDayByLineType.type_of_line),
    );

    return {
      periodId: item.substitute_operating_period_id,
      periodName: item.period_name,
      beginDate: mapDateTimeToFormState(periodBeginDate),
      endDate: mapDateTimeToFormState(periodEndDate),
      beginTime: mapDurationToString(
        item.substitute_operating_day_by_line_types[0].begin_time,
      ),
      endTime: mapDurationToString(
        item.substitute_operating_day_by_line_types[0].end_time,
      ),
      substituteDayOfWeek: mapSubstituteDayOfWeek(
        item.substitute_operating_day_by_line_types[0].substitute_day_of_week,
      ),
      lineTypes: mapLineTypes(lineTypes),
    };
  });
  return { periods };
};

export const mapSubstituteOperatingPeriodsToFormState = (
  data: TimetablesServiceCalendarSubstituteOperatingPeriod[],
) => {
  return convertToPeriodSchema(data);
};

export const OccasionalSubstitutePeriodForm = ({
  onSubmit,
  onRemove,
  values,
}: {
  onSubmit: (state: FormState) => void;
  onRemove: (id: UUID) => void;
  values?: FormState;
}): JSX.Element => {
  const { t } = useTranslation();
  const [isReseting, setIsReseting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rowUnderDeleteOperation, setRowUnderDeleteOperation] = useState<{
    id?: string;
    callback: () => void;
  }>({
    callback: noop,
  });
  const dispatch = useAppDispatch();
  const formRef = useRef<ExplicitAny>(null);
  const methods = useForm<FormState>({
    values,
    resolver: zodResolver(schema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'periods',
  });

  const onSave = () => {
    submitFormByRef(formRef);
  };

  useEffect(() => {
    dispatch(setIsOccasionalSubstitutePeriodFormDirtyAction(isDirty));
  }, [dispatch, isDirty]);

  const handleDelete = () => {
    const { id } = rowUnderDeleteOperation;
    rowUnderDeleteOperation?.callback();
    if (id) {
      onRemove(id);
    }
    // reset(values);
    setIsDeleting(false);
  };

  const handleRowRemove = (index: number, id?: string) => {
    setRowUnderDeleteOperation({ id, callback: () => remove(index) });
    setIsDeleting(true);
  };

  const onReset = () => {
    setIsReseting(false);
    reset();
  };

  return (
    <div className="my-8">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...methods}>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <OccasionalSubstitutePeriodRow
              field={field}
              index={index}
              key={field.id}
              handleRowRemove={handleRowRemove}
            />
          ))}
          <Row className="my-8 items-center space-x-4">
            <span className="text-brand-darker">
              {t('timetables.settings.addRow')}
            </span>
            <SimpleButton
              className="h-full px-3 text-xl"
              onClick={() => append(emptyRowObject)}
              testId={testIds.addRowButton}
            >
              <AiOutlinePlus aria-label={t('timetables.settings.addRow')} />
            </SimpleButton>
          </Row>
          <Row className="my-8 justify-end space-x-4">
            <SimpleButton
              onClick={() => setIsReseting(true)}
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
        isOpen={isReseting}
        onCancel={() => setIsReseting(false)}
        onConfirm={onReset}
        title={t('confirmResetReferenceDayDialog.title')}
        description={t('confirmResetReferenceDayDialog.description')}
        confirmText={t('confirmResetReferenceDayDialog.confirmText')}
        cancelText={t('confirmResetReferenceDayDialog.cancelText')}
      />
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDelete}
        title={t('confirmDeleteReferenceDayDialog.title')}
        description={t('confirmDeleteReferenceDayDialog.description')}
        confirmText={t('confirmDeleteReferenceDayDialog.confirmText')}
        cancelText={t('confirmDeleteReferenceDayDialog.declineText')}
      />
    </div>
  );
};
