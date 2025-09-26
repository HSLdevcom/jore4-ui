import { zodResolver } from '@hookform/resolvers/zod';
import noop from 'lodash/noop';
import { DateTime, Duration } from 'luxon';
import { Dispatch, FC, SetStateAction } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { z } from 'zod';
import { useAppSelector } from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import { Row } from '../../../layoutComponents/Row';
import { selectTimetable } from '../../../redux';
import { parseDate } from '../../../time';
import { DateRange } from '../../../types';
import { SimpleButton } from '../../../uiComponents';
import { areEqual } from '../../../utils';
import { InputField, requiredDate } from '../common';

const testIds = {
  startDate: 'ObservationPeriodForm::startDate',
  endDate: 'ObservationPeriodForm::endDate',
  filterButton: 'ObservationPeriodForm::filterButton',
  warningMessage: 'ObservationPeriodForm::warningMessage',
};

type WarningTextProps = {
  readonly warningMessage: string;
  readonly className?: string;
};

const WarningText: FC<WarningTextProps> = ({
  warningMessage,
  className = '',
}) => {
  return (
    <Row className={`${className} items-center`}>
      <MdWarning className="mr-2 inline text-lg text-grey" />
      <span className="text-grey" data-testid={testIds.warningMessage}>
        {warningMessage}
      </span>
    </Row>
  );
};

const DATE_ORDER = 'timeRange';
const RANGE_TOO_LONG = 'timeRangeTooLong';
const MAX_RANGE = Duration.fromObject({ years: 100 });

function checkMaxDateRange(
  maxLength: Duration,
  startDate: string,
  endDate: string,
) {
  const actualDuration = DateTime.fromISO(endDate).diff(
    DateTime.fromISO(startDate),
  );

  return maxLength.toMillis() >= actualDuration.toMillis();
}

const observationPeriodSchema = z
  .object({
    startDate: requiredDate,
    endDate: requiredDate,
  })
  .superRefine((state, context) => {
    if (state.endDate < state.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: DATE_ORDER,
      });
    } else if (!checkMaxDateRange(MAX_RANGE, state.startDate, state.endDate)) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: RANGE_TOO_LONG,
      });
    }
  });

type ObservationPeriodSchema = z.infer<typeof observationPeriodSchema>;

function toDefaultValues(dateRange: DateRange) {
  return {
    startDate: dateRange.startDate.toISODate(),
    endDate: dateRange.endDate.toISODate(),
  };
}

type ObservationPeriodFormProps = {
  readonly dateRange: DateRange;
  readonly setDateRange: Dispatch<SetStateAction<DateRange>>;
};

export const ObservationPeriodForm: FC<ObservationPeriodFormProps> = ({
  dateRange,
  setDateRange,
}) => {
  const { t } = useTranslation();

  const {
    settings: {
      isOccasionalSubstitutePeriodFormDirty,
      isCommonSubstitutePeriodFormDirty,
    },
  } = useAppSelector(selectTimetable);

  const form = useForm<ObservationPeriodSchema>({
    defaultValues: toDefaultValues(dateRange),
    resolver: zodResolver(observationPeriodSchema),
  });

  const onSubmit = form.handleSubmit((formValues) => {
    setDateRange((prevRange) => {
      const newRange = {
        startDate: parseDate(formValues.startDate),
        endDate: parseDate(formValues.endDate),
      };

      // Preserve object identity
      if (areEqual(prevRange, newRange)) {
        return prevRange;
      }

      return newRange;
    });
  });

  const formDisabled =
    isOccasionalSubstitutePeriodFormDirty || isCommonSubstitutePeriodFormDirty;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <div className="grid grid-flow-row">
          <div className="row grid w-full grid-flow-col grid-cols-3 self-center">
            <div className="col col-span-3 flex items-start space-x-8">
              <InputField<ObservationPeriodSchema>
                type="date"
                translationPrefix="timetables.observationPeriodForm"
                fieldPath="startDate"
                testId={testIds.startDate}
                disabled={formDisabled}
              />
              <InputField<ObservationPeriodSchema>
                type="date"
                translationPrefix="timetables.observationPeriodForm"
                fieldPath="endDate"
                testId={testIds.endDate}
                disabled={formDisabled}
              />
              <div className="flex self-end pb-2">
                <SimpleButton
                  type="submit"
                  onClick={noop}
                  testId={testIds.filterButton}
                  disabled={formDisabled}
                >
                  Suodata
                </SimpleButton>
              </div>
            </div>
          </div>
          <div className="row col-span-4 w-full items-start self-start text-left">
            <Visible visible={formDisabled}>
              <WarningText
                warningMessage={t(
                  'timetables.observationPeriodForm.warningMessage',
                )}
              />
            </Visible>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
