import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Row } from '@/layoutComponents/Row';
import { Visible } from '@/layoutComponents/Visible';
import { selectTimetable } from '@/redux/selectors';
import { LoadingWrapper } from '@/uiComponents/LoadingWrapper';
import { SimpleButton } from '@/uiComponents/SimpleButton';
import { DateValidatorSource } from '@/utils/date-control-validator';
import { useDateControlValidator } from '@/utils/date-control-validator/useDateControlValidator';
import {
  QueryParameterName,
  useAppSelector,
  useDateQueryParam,
  useTimeRangeQueryParams,
  useUrlQuery,
} from '../../../hooks';
import { DateControl } from '../../common';
import { ValidationError } from '../common';

const testIds = {
  startDate: 'ObservationPeriodForm::startDate',
  endDate: 'ObservationPeriodForm::endDate',
  loadingSubstituteDays: 'LoadingWrapper::loadingSubstituteDays',
};

interface WarningTextProps {
  warningMessage: string;
  className?: string;
}

const WarningText = ({
  warningMessage,
  className = '',
}: WarningTextProps): React.ReactElement => {
  return (
    <Row className={`${className} items-center`}>
      <MdWarning className="mr-2 inline text-lg text-grey" />
      <span className="text-grey">{warningMessage}</span>
    </Row>
  );
};

const handleStartDateChange = (
  newDate: DateTime,
  setQueryStartDate: (date: DateTime | null) => void,
) => {
  setQueryStartDate(newDate);
};
const handleEndDateChange = (
  newDate: DateTime,
  setQueryEndDate: (date: DateTime | null) => void,
) => {
  setQueryEndDate(newDate);
};

export const ObservationPeriodForm = (): React.ReactElement => {
  const { t } = useTranslation();
  const { isInvalidDateRange } = useTimeRangeQueryParams();
  const {
    settings: {
      isOccasionalSubstitutePeriodFormDirty,
      isCommonSubstitutePeriodFormDirty,
    },
  } = useAppSelector(selectTimetable);

  const [isLoading, setIsLoading] = useState(true);

  const { date: startDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: true,
  });

  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: true,
  });

  const { setMultipleParametersToUrlQuery } = useUrlQuery();
  const [queryStartDate, setQueryStartDate] = useState<DateTime | null>(
    startDate,
  );
  const [queryEndDate, setQueryEndDate] = useState<DateTime | null>(endDate);

  const { validator } = useDateControlValidator(
    DateValidatorSource.SubstitutePeriodStartDay,
    [QueryParameterName.StartDate, QueryParameterName.EndDate],
  );

  const handleSubmit = useCallback(() => {
    if (queryStartDate && queryEndDate) {
      setMultipleParametersToUrlQuery({
        replace: true,
        parameters: [
          { paramName: QueryParameterName.StartDate, value: queryStartDate },
          { paramName: QueryParameterName.EndDate, value: queryEndDate },
        ],
      });
    }
  }, [queryEndDate, queryStartDate, setMultipleParametersToUrlQuery]);

  const handleKeyDown = useCallback(
    // @ts-expect-error Complains about both KeyboardEvent KeyboardEventHandler
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  useEffect(() => {
    if (validator && startDate && endDate) {
      setIsLoading(false);
    }
  }, [endDate, startDate, validator]);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={isLoading}
      testId={testIds.loadingSubstituteDays}
    >
      <div>
        <div className="grid grid-flow-col grid-cols-2">
          {/* Allow enter handler to query elements */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="col col-span-3 flex items-center space-x-4"
            onKeyDown={handleKeyDown}
          >
            <DateControl
              label={t('timetables.observationPeriodForm.startDate')}
              dateInputId="startDate"
              testId={testIds.startDate}
              queryParamName={QueryParameterName.StartDate}
              disabled={
                isOccasionalSubstitutePeriodFormDirty ||
                isCommonSubstitutePeriodFormDirty
              }
              validator={validator}
              validatorProps={{ startDate, endDate }}
              handleChange={(date: DateTime) =>
                handleStartDateChange(date, setQueryStartDate)
              }
            />
            <DateControl
              label={t('timetables.observationPeriodForm.endDate')}
              dateInputId="endDate"
              testId={testIds.endDate}
              queryParamName={QueryParameterName.EndDate}
              disabled={
                isOccasionalSubstitutePeriodFormDirty ||
                isCommonSubstitutePeriodFormDirty
              }
              handleChange={(date: DateTime) =>
                handleEndDateChange(date, setQueryEndDate)
              }
            />
            <div className="col col-span-1 items-end" />
            <SimpleButton
              onClick={() => handleSubmit()}
              className="item self-end"
            >
              {t('timetables.filter')}
            </SimpleButton>
          </div>
        </div>

        <div className="h-12 pt-2">
          <Visible visible={isInvalidDateRange}>
            <ValidationError errorMessage={t('formValidation.timeRange')} />
          </Visible>
          <Visible
            visible={
              isOccasionalSubstitutePeriodFormDirty ||
              isCommonSubstitutePeriodFormDirty
            }
          >
            <WarningText
              warningMessage={t(
                'timetables.observationPeriodForm.warningMessage',
              )}
            />
          </Visible>
        </div>
      </div>
    </LoadingWrapper>
  );
};
