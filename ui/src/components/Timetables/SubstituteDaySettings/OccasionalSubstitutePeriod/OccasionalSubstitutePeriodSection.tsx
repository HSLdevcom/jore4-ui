import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import { DateTime } from 'luxon';
import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRange } from '../../../../types';
import { areEqual } from '../../../../utils';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import {
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetOccasionalSubstituteOperatingPeriods,
} from '../Utils';
import { OccasionalSubstitutePeriodForm } from './OccasionalSubstitutePeriodForm';
import {
  CommonSubstitutePeriodType,
  FormState,
  PeriodType,
} from './OccasionalSubstitutePeriodForm.types';

function findEarliestDate(
  periods: ReadonlyArray<PeriodType | CommonSubstitutePeriodType>,
) {
  const periodWithEarliestdate = minBy(periods, 'beginDate');
  return DateTime.fromISO(periodWithEarliestdate?.beginDate ?? '');
}

function findLatestDate(
  periods: ReadonlyArray<PeriodType | CommonSubstitutePeriodType>,
) {
  const periodWithlatestDate = maxBy(periods, 'endDate');
  return DateTime.fromISO(periodWithlatestDate?.endDate ?? '');
}

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

  const createSubstituteOperatingPeriod = useCreateSubstituteOperatingPeriod();
  const editSubstituteOperatingPeriod = useEditSubstituteOperatingPeriod();
  const deleteSubstituteOperatingPeriod = useDeleteSubstituteOperatingPeriod();

  const onSubmit = async ({ periods }: FormState) => {
    try {
      await deleteSubstituteOperatingPeriod(periods);
      await editSubstituteOperatingPeriod(periods);
      await createSubstituteOperatingPeriod(periods);

      setDateRange((prevRange) => {
        const newRange = {
          startDate: findEarliestDate(periods),
          endDate: findLatestDate(periods),
        };

        // Preserve object identity
        if (areEqual(prevRange, newRange)) {
          return prevRange;
        }

        return newRange;
      });

      await refetch();

      showSuccessToast(t(($) => $.timetables.settings.saveSuccess));
    } catch (err) {
      showDangerToastWithError(
        t(($) => $.errors.saveFailed),
        err,
      );
    }
  };

  return (
    <div className="pt-8">
      <h2>{t(($) => $.timetables.settings.occasionalSubstituteDays)}</h2>
      <OccasionalSubstitutePeriodForm
        onSubmit={onSubmit}
        loading={loading}
        periods={occasionalSubstituteOperatingPeriods}
      />
    </div>
  );
};
