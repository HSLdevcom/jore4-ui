import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-cycle
import {
  CommonSubstituteOperatingPeriodsData,
  useCreateSubstituteOperatingPeriod,
  useDeleteSubstituteOperatingPeriod,
  useEditSubstituteOperatingPeriod,
} from '../../../../hooks/substitute-operating-periods';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { showDangerToastWithError, showSuccessToast } from '../../../../utils';
import {
  CommonSubstitutePeriodForm,
  mapCommonSubstituteOperatingPeriodsToCommonDays,
} from './CommonSubstitutePeriodForm';
import { FormState } from './CommonSubstitutePeriodForm.types';

interface Props {
  className?: string;
  commonSubstituteOperatingPeriodData: CommonSubstituteOperatingPeriodsData | null;
}

const testIds = {
  loadingCommonSubstitutePeriods:
    'CommonSubstitutePeriodSection::loadingCommonSubstitutePeriods',
};

export const CommonSubstitutePeriodSection = ({
  className = '',
  commonSubstituteOperatingPeriodData,
}: Props): React.ReactElement => {
  const { t } = useTranslation();

  const { prepareAndExecute: prepareAndExecuteCreate } =
    useCreateSubstituteOperatingPeriod();

  const { prepareAndExecute: prepareAndExecuteEdit } =
    useEditSubstituteOperatingPeriod();

  const { deleteSubstituteOperatingPeriod } =
    useDeleteSubstituteOperatingPeriod();

  if (!commonSubstituteOperatingPeriodData) {
    return (
      <LoadingWrapper testId="loadingCommonSubstitutePeriods">
        <></>
      </LoadingWrapper>
    );
  }
  const { isLoadingCommonSubstituteOperatingPeriods } =
    commonSubstituteOperatingPeriodData;

  const {
    refetchCommonSubstituteOperatingPeriods,
    commonSubstituteOperatingPeriods,
  } = commonSubstituteOperatingPeriodData;

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
      refetchCommonSubstituteOperatingPeriods();

      showSuccessToast(t('timetables.settings.saveSuccess'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  return (
    <div className={className}>
      <h2>{t('timetables.settings.commonSubstituteDays')}</h2>
      <LoadingWrapper
        loading={isLoadingCommonSubstituteOperatingPeriods}
        testId={testIds.loadingCommonSubstitutePeriods}
        className="flex justify-center"
      >
        <CommonSubstitutePeriodForm
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
