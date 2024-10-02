import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Row } from '@/layoutComponents/Row';
import { Visible } from '@/layoutComponents/Visible';
import { selectTimetable } from '@/redux/selectors';
import {
  QueryParameterName,
  useAppSelector,
  useTimeRangeQueryParams,
} from '../../../hooks';
import { DateControl } from '../../common';
import { ValidationError } from '../common';

const testIds = {
  startDate: 'ObservationPeriodForm::startDate',
  endDate: 'ObservationPeriodForm::endDate',
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

export const ObservationPeriodForm = (): React.ReactElement => {
  const { t } = useTranslation();
  const { isInvalidDateRange } = useTimeRangeQueryParams();
  const {
    settings: {
      isOccasionalSubstitutePeriodFormDirty,
      isCommonSubstitutePeriodFormDirty,
    },
  } = useAppSelector(selectTimetable);

  return (
    <div>
      <div className="flex space-x-8">
        <DateControl
          label={t('timetables.observationPeriodForm.startDate')}
          dateInputId="startDate"
          testId={testIds.startDate}
          queryParamName={QueryParameterName.StartDate}
          disabled={
            isOccasionalSubstitutePeriodFormDirty ||
            isCommonSubstitutePeriodFormDirty
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
        />
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
  );
};
