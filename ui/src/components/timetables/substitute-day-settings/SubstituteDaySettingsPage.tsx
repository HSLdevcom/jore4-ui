import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ObservationPeriodForm } from '@/components/forms/timetables/ObservationPeriodForm';
import { CommonSubstitutePeriodSection , OccasionalSubstitutePeriodSection , SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '@/components/timetables';
import { useAppSelector } from '@/hooks/redux';
import {
  useGetCommonSubstituteOperatingPeriods,
  useGetOccasionalSubstituteOperatingPeriods,
} from '@/hooks/substitute-operating-periods';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
import { Container, Row } from '@/layoutComponents';
import { selectTimetable } from '@/redux';
import { Path } from '@/router/routeDetails';
import { CloseIconButton } from '@/uiComponents/CloseIconButton';
import { ConfirmationDialog } from '@/uiComponents/ConfirmationDialog';
import { LoadingWrapper } from '@/uiComponents/LoadingWrapper';

const testIds = {
  closeButton: 'SubstituteDaySettingsPage::closeButton',
  loadingSubstituteDays: 'LoadingWrapper::loadingSubstituteDays',
};

export const SubstituteDaySettingsPage = (): React.ReactElement => {
  const { t } = useTranslation();

  const {
    settings: {
      isOccasionalSubstitutePeriodFormDirty,
      isCommonSubstitutePeriodFormDirty,
    },
  } = useAppSelector(selectTimetable);

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { date: startDate, setDateToUrl: setStartDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: false,
  });
  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: false,
  });

  const { getOccasionalSubstituteOperatingPeriodData } =
    useGetOccasionalSubstituteOperatingPeriods({ startDate, endDate });

  const occasionalSubstituteOperatingPeriodData = useMemo(() => {
    return getOccasionalSubstituteOperatingPeriodData();
  }, [getOccasionalSubstituteOperatingPeriodData]);

  const { getCommonSubstituteOperatingPeriodData } =
    useGetCommonSubstituteOperatingPeriods({ startDate, endDate });

  const commonSubstituteOperatingPeriodData = useMemo(() => {
    return getCommonSubstituteOperatingPeriodData();
  }, [getCommonSubstituteOperatingPeriodData]);

  // Workaround for useDateQueryParam hook side effects
  const doSetStartupDate = useCallback((newDate: DateTime) => {
    setStartDate(newDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    setIsLoading(true);
    const timeDiff = endDate.diff(startDate);
    if (timeDiff.as('year') > SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS) {
      const newStartDate = endDate.minus({
        year: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
      });
      doSetStartupDate(newStartDate);
    }
    setIsLoading(false);
  }, [doSetStartupDate, startDate, endDate]);

  const handleClose = () => {
    if (
      isOccasionalSubstitutePeriodFormDirty ||
      isCommonSubstitutePeriodFormDirty
    ) {
      setIsOpen(true);
    } else {
      navigate(Path.timetables);
    }
  };

  const closePage = () => {
    navigate(Path.timetables);
  };

  return (
    <Container>
      <LoadingWrapper
        className="flex justify-center"
        loadingText={t('search.searching')}
        loading={
          isLoading &&
          !!commonSubstituteOperatingPeriodData &&
          !!occasionalSubstituteOperatingPeriodData
        }
        testId={testIds.loadingSubstituteDays}
      >
        <Row className="justify-between py-8">
          <h1>{t('timetables.daySettings')}</h1>
          <CloseIconButton
            testId={testIds.closeButton}
            label={t('close')}
            className="text-base font-bold text-brand"
            onClick={handleClose}
          />
        </Row>
        <div className="space-y-4 rounded-md bg-hsl-neutral-blue px-8 pb-4 pt-10">
          <h4>{t('timetables.filter')}</h4>
          <ObservationPeriodForm />
        </div>
        <div className="divide-y">
          <CommonSubstitutePeriodSection
            commonSubstituteOperatingPeriodData={
              commonSubstituteOperatingPeriodData
            }
            className="my-8"
          />
        </div>
        <hr />
        <div className="divide-y">
          <OccasionalSubstitutePeriodSection
            occasionalSubstituteOperatingPeriodData={
              occasionalSubstituteOperatingPeriodData
            }
          />
        </div>
        <hr />
        <ConfirmationDialog
          isOpen={isOpen}
          onCancel={() => setIsOpen(false)}
          onConfirm={closePage}
          title={t('confirmSubstituteDaySettingsPageLeave.title')}
          description={t('confirmSubstituteDaySettingsPageLeave.description')}
          confirmText={t('confirmSubstituteDaySettingsPageLeave.confirmText')}
          cancelText={t('confirmSubstituteDaySettingsPageLeave.cancelText')}
        />
      </LoadingWrapper>
    </Container>
  );
};
