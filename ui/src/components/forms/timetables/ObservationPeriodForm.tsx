import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryParameterName, useTimeRangeQueryParams } from '../../../hooks';
import { DialogWithButtons } from '../../../uiComponents';
import { DateControl } from '../../common/DateControl';
import { FormRow, ValidationError } from '../common';

const testIds = {
  startDate: 'TimetableFilterForm::startDate',
  endDate: 'TimetableFilterForm::endDate',
};

export const ObservationPeriodForm = ({
  isDirty,
}: {
  isDirty: boolean;
}): JSX.Element => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isInvalidDateRange } = useTimeRangeQueryParams();

  const handleChange = (e: React.MouseEvent<HTMLInputElement>) => {
    if (isDirty) {
      e.preventDefault();
      setIsConfirming(true);
    }
  };

  return (
    <>
      <FormRow mdColumns={9}>
        <DateControl
          label={t('timetables.filterForm.startDate')}
          dateInputId="startDate"
          className="max-w-max"
          testId={testIds.startDate}
          queryParamName={QueryParameterName.StartDate}
          onClick={handleChange}
        />
        <DateControl
          label={t('timetables.filterForm.endDate')}
          dateInputId="endDate"
          className="max-w-max"
          testId={testIds.endDate}
          queryParamName={QueryParameterName.EndDate}
          onClick={handleChange}
        />
      </FormRow>
      {isInvalidDateRange && (
        <ValidationError errorMessage={t('formValidation.timeRange')} />
      )}

      <DialogWithButtons
        isOpen={isConfirming}
        title={t('confirmReferenceDayFilterDialog.title')}
        description={t('confirmReferenceDayFilterDialog.description')}
        buttons={[
          {
            onClick: () => setIsConfirming(false),
            text: t('confirmReferenceDayFilterDialog.confirmText'),
          },
        ]}
        onCancel={() => setIsConfirming(false)}
      />
    </>
  );
};
