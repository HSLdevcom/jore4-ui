import { useTranslation } from 'react-i18next';
import { QueryParameterName, useTimeRangeQueryParams } from '../../hooks';
import { Row } from '../../layoutComponents';
import { ValidationError } from '../forms/common/ValidationErrorList';
import { DateControl } from './DateControl';

export const TimeRangeControl = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const testIds = {
    startDate: 'TimeRangeControl::startDate',
    endDate: 'TimeRangeControl::endDate',
  };
  const { isInvalidDateRange } = useTimeRangeQueryParams();
  return (
    <div className={className}>
      <Row className="space-x-8">
        <DateControl
          label={t('validityPeriod.validityStart')}
          dateInputId="startDate"
          className="max-w-max"
          testId={testIds.startDate}
          queryParamName={QueryParameterName.StartDate}
        />
        <DateControl
          label={t('validityPeriod.validityEnd')}
          dateInputId="endDate"
          className="max-w-max"
          testId={testIds.endDate}
          queryParamName={QueryParameterName.EndDate}
        />
      </Row>
      {isInvalidDateRange && (
        <ValidationError
          fieldPath="timeRange"
          errorMessage={t('formValidation.timeRange')}
        />
      )}
    </div>
  );
};
