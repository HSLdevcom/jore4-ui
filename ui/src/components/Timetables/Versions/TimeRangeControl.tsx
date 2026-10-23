import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimeRangeQueryParams } from '../../../hooks';
import { DateInput, ValidationError } from '../../common/Inputs';
import { Row } from '../../common/LayoutComponents';
import { TimetableVersionsRouterState } from './Utils';

type TimeRangeControlProps = {
  readonly className?: string;
  readonly startDate: Temporal.PlainDate;
  readonly endDate: Temporal.PlainDate;
  readonly onChange: Dispatch<SetStateAction<TimetableVersionsRouterState>>;
};

export const TimeRangeControl: FC<TimeRangeControlProps> = ({
  className,
  startDate,
  endDate,
  onChange,
}) => {
  const { t } = useTranslation();
  const testIds = {
    startDate: 'TimeRangeControl::startDate',
    endDate: 'TimeRangeControl::endDate',
  };
  const { isInvalidDateRange } = useTimeRangeQueryParams();

  return (
    <div className={className}>
      <Row className="gap-8">
        <DateInput
          label={t(($) => $.validityPeriod.validityStart)}
          dateInputId="startDate"
          className="max-w-max"
          testId={testIds.startDate}
          value={startDate}
          onChange={(newStartDate) => {
            onChange((prev) => ({ ...prev, startDate: newStartDate }));
          }}
        />

        <DateInput
          label={t(($) => $.validityPeriod.validityEnd)}
          dateInputId="endDate"
          className="max-w-max"
          testId={testIds.endDate}
          value={endDate}
          onChange={(newEndDate) => {
            onChange((prev) => ({ ...prev, endDate: newEndDate }));
          }}
        />
      </Row>

      {isInvalidDateRange && (
        <ValidationError
          fieldPath="timeRange"
          errorMessage={t(($) => $.formValidation.timeRange)}
        />
      )}
    </div>
  );
};
