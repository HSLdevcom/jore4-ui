import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import { useTimeRangeQueryParams } from '../../../../hooks';
import {
  useDeleteOperationPeriod,
  useEditSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriods,
} from '../../../../hooks/reference-days';
import { useCreateSubstituteOperatingPeriod } from '../../../../hooks/reference-days/useCreateSubstituteOperatingPeriod';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '../../../../utils/toastService';
import { RandomReferenceDayForm } from './RandomReferenceDayForm';
import {
  RandomReferenceFormState as FormState,
  PeriodType,
} from './RandomReferenceDayForm.types';

interface Props {
  setIsDirty: (isDirty: boolean) => void;
}

export const RandomReferenceDay = ({ setIsDirty }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { startDate, endDate } = useTimeRangeQueryParams();

  const { refetchSubstituteOperatingPeriods, randomReferenceDaysFormState } =
    useGetSubstituteOperatingPeriods({ startDate, endDate });

  const { deleteSubstituteOperatingPeriod } = useDeleteOperationPeriod();
  const {
    updateSubstituteOperatingPeriodMutation,
    mapFormStateToEditVariables,
  } = useEditSubstituteOperatingPeriod();
  const {
    createSubstituteOperatingPeriodMutation,
    mapFormStateToCreateVariables,
  } = useCreateSubstituteOperatingPeriod();

  const onSubmit = async (form: FormState) => {
    // Periods that are already in the database (have periodId) will be updated
    // Periods without id will be inserted to the database
    const { insert, update } = form.periods.reduce(
      (result: { insert: PeriodType[]; update: PeriodType[] }, period) => {
        if (period.periodId) {
          result.update.push(period);
        } else {
          result.insert.push(period);
        }
        return result;
      },
      { insert: [], update: [] },
    );

    try {
      if (!isEmpty(update)) {
        await updateSubstituteOperatingPeriodMutation(
          mapFormStateToEditVariables(update),
        );
      }

      if (!isEmpty(insert)) {
        await createSubstituteOperatingPeriodMutation(
          mapFormStateToCreateVariables(insert),
        );
      }
      refetchSubstituteOperatingPeriods();
      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const onRemove = async (id: UUID) => {
    try {
      await deleteSubstituteOperatingPeriod(id);
      refetchSubstituteOperatingPeriods();
      showSuccessToast(t('timetables.settings.deleteSuccess'));
    } catch (err) {
      showDangerToastWithError(t('timetables.settings.deleteFailed'), err);
    }
  };

  return (
    <div className="py-8">
      <h2>{t('timetables.settings.randomReferenceDays')}</h2>
      <RandomReferenceDayForm
        onRemove={onRemove}
        onSubmit={onSubmit}
        values={randomReferenceDaysFormState}
        setIsDirty={setIsDirty}
      />
    </div>
  );
};
