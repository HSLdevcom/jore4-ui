import { useTranslation } from 'react-i18next';
import {
  useCreateSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
  useGetSubstituteOperatingPeriods,
} from '../../../../hooks/substitute-operating-periods';
import { useTimeRangeQueryParams } from '../../../../hooks/urlQuery';
import { showDangerToastWithError, showSuccessToast } from '../../../../utils';
import {
  CommonSubstitutePeriodForm,
  mapCommonSubstituteOperatingPeriodsToCommonDays,
} from './CommonSubstitutePeriodForm';
import { FormState } from './CommonSubstitutePeriodForm.types';

interface Props {
  className?: string;
}

export const CommonSubstitutePeriodSection = ({
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { startDate, endDate } = useTimeRangeQueryParams();

  const {
    presetSubstituteOperatingPeriods,
    refetchSubstituteOperatingPeriods,
  } = useGetSubstituteOperatingPeriods({ startDate, endDate });
  const { prepareAndExecute: prepareAndExecuteCreate } =
    useCreateSubstituteOperatingPeriod();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditSubstituteOperatingPeriod();

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
      }));

    try {
      await prepareAndExecuteEdit({ form: { periods } });
      await prepareAndExecuteCreate({ form: { periods } });
      refetchSubstituteOperatingPeriods();

      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  return (
    <div className={className}>
      <h2>{t('timetables.settings.commonSubstituteDays')}</h2>
      <CommonSubstitutePeriodForm
        className="my-8"
        commonDays={mapCommonSubstituteOperatingPeriodsToCommonDays(
          commonSubstituteOperatingPeriods,
        )}
        onSubmit={onSubmit}
      />
    </div>
  );
};