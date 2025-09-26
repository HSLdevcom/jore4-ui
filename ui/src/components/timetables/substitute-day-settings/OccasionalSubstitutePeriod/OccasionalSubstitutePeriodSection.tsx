import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange } from '../../../../types';
import { areEqual } from '../../../../utils';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import { useCreateSubstituteOperatingPeriod } from '../hooks/useCreateSubstituteOperatingPeriod';
import { useDeleteSubstituteOperatingPeriod } from '../hooks/useDeleteSubstituteOperatingPeriod';
import { useEditSubstituteOperatingPeriod } from '../hooks/useEditSubstituteOperatingPeriod';
import { useGetOccasionalSubstituteOperatingPeriods } from '../hooks/useGetSubstituteOperatingPeriod';
import {
  OccasionalSubstitutePeriodForm,
  findEarliestDate,
  findLatestDate,
  mapOccasionalSubstituteOperatingPeriodsToFormState,
} from './OccasionalSubstitutePeriodForm';
import { FormState } from './OccasionalSubstitutePeriodForm.types';

type OccasionalSubstitutePeriodSectionProps = {
  readonly dateRange: DateRange;
  readonly setDateRange: Dispatch<SetStateAction<DateRange>>;
};

export const OccasionalSubstitutePeriodSection: FC<
  OccasionalSubstitutePeriodSectionProps
> = ({ dateRange, setDateRange }) => {
  const { t } = useTranslation();
  const {
    substitutePeriods: occasionalSubstituteOperatingPeriods,
    refetch,
    loading,
  } = useGetOccasionalSubstituteOperatingPeriods(dateRange);
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

      setDateRange((prevRange) => {
        const newRange = {
          startDate: findEarliestDate(form),
          endDate: findLatestDate(form),
        };

        // Preserve object identity
        if (areEqual(prevRange, newRange)) {
          return prevRange;
        }

        return newRange;
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
