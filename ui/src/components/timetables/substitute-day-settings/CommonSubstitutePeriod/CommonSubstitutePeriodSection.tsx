import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetCommonSubstituteOperatingPeriods,
} from '../../../../hooks/substitute-operating-periods';
import { DateRange } from '../../../../types';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { showDangerToastWithError, showSuccessToast } from '../../../../utils';
import {
  CommonSubstitutePeriodForm,
  mapCommonSubstituteOperatingPeriodsToCommonDays,
} from './CommonSubstitutePeriodForm';
import { FormState } from './CommonSubstitutePeriodForm.types';

type CommonSubstitutePeriodSectionProps = {
  readonly className?: string;
  readonly dateRange: DateRange;
};

const testIds = {
  loadingCommonSubstitutePeriods:
    'CommonSubstitutePeriodSection::loadingCommonSubstitutePeriods',
};

export const CommonSubstitutePeriodSection: FC<
  CommonSubstitutePeriodSectionProps
> = ({ className = '', dateRange }) => {
  const { t } = useTranslation();

  const { commonSubstituteOperatingPeriods, refetch, loading } =
    useGetCommonSubstituteOperatingPeriods(dateRange);

  const { prepareAndExecute: prepareAndExecuteCreate } =
    useCreateSubstituteOperatingPeriod();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditSubstituteOperatingPeriod();

  const { deleteSubstituteOperatingPeriod } =
    useDeleteSubstituteOperatingPeriod();

  const onSubmit = async (form: FormState) => {
    // Filter out days that are not already in database or are not added in UI
    // Add to begin/end date for each day to match
    // occasional substitute operating periods form type
    const periods = form.commonDays
      .filter((day) => day.created || day.fromDatabase)
      .map((d) => ({
        ...d,
        beginDate: d.supersededDate,
        endDate: d.supersededDate,
        toBeDeleted: d.toBeDeleted ?? false,
      }));

    try {
      await deleteSubstituteOperatingPeriod({ periods });
      await prepareAndExecuteEdit({ form: { periods } });
      await prepareAndExecuteCreate({ form: { periods } });
      await refetch();

      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  return (
    <div className={className}>
      <h2>{t('timetables.settings.commonSubstituteDays')}</h2>
      <LoadingWrapper
        loading={loading}
        testId={testIds.loadingCommonSubstitutePeriods}
        className="flex justify-center"
      >
        <CommonSubstitutePeriodForm
          dateRange={dateRange}
          className="my-8"
          commonDays={mapCommonSubstituteOperatingPeriodsToCommonDays(
            commonSubstituteOperatingPeriods,
          )}
          onSubmit={onSubmit}
        />
      </LoadingWrapper>
    </div>
  );
};
