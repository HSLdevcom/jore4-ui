import { useTranslation } from 'react-i18next';
import { useTimeRangeQueryParams } from '../../../../hooks';
import {
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriods,
} from '../../../../hooks/substitute-operating-periods';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import {
  OccasionalSubstitutePeriodForm,
  findEarliestDate,
  findLatestDate,
  mapSubstituteOperatingPeriodsToFormState as mapOccasionalSubstituteOperatingPeriodsToFormState,
} from './OccasionalSubstitutePeriodForm';
import { FormState } from './OccasionalSubstitutePeriodForm.types';

export const OccasionalSubstitutePeriodSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { startDate, endDate, updateTimeRangeIfNeeded } =
    useTimeRangeQueryParams();

  const {
    occasionalSubstituteOperatingPeriods,
    refetchOccasionalSubstituteOperatingPeriods,
  } = useGetSubstituteOperatingPeriods({ startDate, endDate });

  const { prepareAndExecute: prepareAndExecuteCreate } =
    useCreateSubstituteOperatingPeriod();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditSubstituteOperatingPeriod();

  const { deleteSubstituteOperatingPeriod } =
    useDeleteSubstituteOperatingPeriod();

  const onSubmit = async (form: FormState) => {
    try {
      await deleteSubstituteOperatingPeriod(form);
      await prepareAndExecuteEdit({ form });
      await prepareAndExecuteCreate({ form });

      updateTimeRangeIfNeeded(findEarliestDate(form), findLatestDate(form));

      refetchOccasionalSubstituteOperatingPeriods();

      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  return (
    <div className="pt-8">
      <h2>{t('timetables.settings.occasionalSubstituteDays')}</h2>
      <OccasionalSubstitutePeriodForm
        onSubmit={onSubmit}
        values={mapOccasionalSubstituteOperatingPeriodsToFormState(
          occasionalSubstituteOperatingPeriods,
        )}
      />
    </div>
  );
};
