import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetOccasionalSubstituteOperatingPeriods,
} from '../../../../hooks/substitute-operating-periods';
import { DateRange } from '../../../../types';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import {
  OccasionalSubstitutePeriodForm,
  findEarliestDate,
  findLatestDate,
  mapOccasionalSubstituteOperatingPeriodsToFormState,
} from './OccasionalSubstitutePeriodForm';
import { FormState } from './OccasionalSubstitutePeriodForm.types';

type Props = {
  readonly dateRange: DateRange;
  readonly setDateRange: Dispatch<SetStateAction<DateRange>>;
};

export const OccasionalSubstitutePeriodSection: FC<Props> = ({
  dateRange,
  setDateRange,
}) => {
  const { t } = useTranslation();
  const { occasionalSubstituteOperatingPeriods, refetch, loading } =
    useGetOccasionalSubstituteOperatingPeriods(dateRange);
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

      setDateRange({
        startDate: findEarliestDate(form),
        endDate: findLatestDate(form),
      });

      await refetch();

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
        loading={loading}
        values={mapOccasionalSubstituteOperatingPeriodsToFormState(
          occasionalSubstituteOperatingPeriods,
        )}
      />
    </div>
  );
};
