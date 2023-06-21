import { useTranslation } from 'react-i18next';
import { useTimeRangeQueryParams } from '../../../../hooks';
import {
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriods,
} from '../../../../hooks/reference-days';
import { useCreateSubstituteOperatingPeriod } from '../../../../hooks/reference-days/useCreateSubstituteOperatingPeriod';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import {
  OccasionalSubstitutePeriodForm,
  mapSubstituteOperatingPeriodsToFormState,
} from './OccasionalSubstitutePeriodForm';
import { FormState } from './OccasionalSubstitutePeriodForm.types';

export const OccasionalSubstitutePeriodSection = (): JSX.Element => {
  const { t } = useTranslation();
  const { startDate, endDate } = useTimeRangeQueryParams();

  const { substituteOperatingPeriods, refetchSubstituteOperatingPeriods } =
    useGetSubstituteOperatingPeriods({ startDate, endDate });

  const { prepareAndExecute: prepareAndExecuteCreate } =
    useCreateSubstituteOperatingPeriod();
  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditSubstituteOperatingPeriod();
  const { deleteSubstituteOperatingPeriod } =
    useDeleteSubstituteOperatingPeriod();

  const onSubmit = async (form: FormState) => {
    try {
      await prepareAndExecuteEdit({ form });
      await prepareAndExecuteCreate({ form });

      refetchSubstituteOperatingPeriods();
      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onRemove = async (id: UUID) => {
    try {
      await deleteSubstituteOperatingPeriod(id);
      showSuccessToast(t('timetables.settings.deleteSuccess'));
    } catch (err) {
      showDangerToastWithError(t('timetables.settings.deleteFailed'), err);
    }
  };

  return (
    <div className="py-8">
      <h2>{t('timetables.settings.occasionalSubstituteDays')}</h2>
      <OccasionalSubstitutePeriodForm
        onRemove={onRemove}
        onSubmit={onSubmit}
        values={mapSubstituteOperatingPeriodsToFormState(
          substituteOperatingPeriods,
        )}
      />
    </div>
  );
};
