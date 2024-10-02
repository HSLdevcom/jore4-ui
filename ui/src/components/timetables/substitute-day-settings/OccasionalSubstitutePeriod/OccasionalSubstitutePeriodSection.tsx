import { useTranslation } from 'react-i18next';
import {
  OccasionalSubstituteOperatingPeriodsData,
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetOccasionalSubstituteOperatingPeriods,
} from '@/hooks/substitute-operating-periods/';
import { useTimeRangeQueryParams } from '@/hooks/urlQuery';
import { LoadingWrapper } from '@/uiComponents/LoadingWrapper';
import {
  showDangerToastWithError,
  showSuccessToast,
} from '@/utils/toastService';
import {
  OccasionalSubstitutePeriodForm,
  findEarliestDate,
  findLatestDate,
  mapOccasionalSubstituteOperatingPeriodsToFormState,
} from './OccasionalSubstitutePeriodForm';
import { FormState } from './OccasionalSubstitutePeriodForm.types';

export const OccasionalSubstitutePeriodSection =
  (): React.ReactElement<OccasionalSubstituteOperatingPeriodsData> => {
    const { occasionalSubstituteOperatingPeriodData } =
      useGetOccasionalSubstituteOperatingPeriods();

    const { t } = useTranslation();
    const { updateTimeRangeIfNeeded } = useTimeRangeQueryParams();

    const { prepareAndExecute: prepareAndExecuteCreate } =
      useCreateSubstituteOperatingPeriod();

    const { prepareAndExecute: prepareAndExecuteEdit } =
      useEditSubstituteOperatingPeriod();

    const { deleteSubstituteOperatingPeriod } =
      useDeleteSubstituteOperatingPeriod();

    if (
      !occasionalSubstituteOperatingPeriodData ||
      occasionalSubstituteOperatingPeriodData.isLoadingOccasionalSubstituteOperatingPeriods
    ) {
      return (
        <LoadingWrapper testId="loadingCommonSubstitutePeriods">
          <></>
        </LoadingWrapper>
      );
    }

    const {
      refetchOccasionalSubstituteOperatingPeriods,
      occasionalSubstituteOperatingPeriods,
      isLoadingOccasionalSubstituteOperatingPeriods,
    } = occasionalSubstituteOperatingPeriodData;

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
          loading={isLoadingOccasionalSubstituteOperatingPeriods}
          values={mapOccasionalSubstituteOperatingPeriodsToFormState(
            occasionalSubstituteOperatingPeriods,
          )}
        />
      </div>
    );
  };
