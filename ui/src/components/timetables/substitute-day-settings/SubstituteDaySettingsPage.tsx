import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  QueryParameterName,
  useAppSelector,
  useDateQueryParam,
  useUrlQuery,
} from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { DateRange } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { CloseIconButton } from '../../../uiComponents/CloseIconButton';
import { PageTitle } from '../../common';
import { ObservationPeriodForm } from '../../forms/timetables/ObservationPeriodForm';
import { CommonSubstitutePeriodSection } from './CommonSubstitutePeriod/CommonSubstitutePeriodSection';
import { OccasionalSubstitutePeriodSection } from './OccasionalSubstitutePeriod';

const testIds = {
  closeButton: 'SubstituteDaySettingsPage::closeButton',
};

export const SubstituteDaySettingsPage = (): React.ReactElement => {
  const { t } = useTranslation();

  const { date: startDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: true,
  });
  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: true,
  });

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate,
    endDate,
  });

  const { setMultipleParametersToUrlQuery } = useUrlQuery();
  useEffect(() => {
    setMultipleParametersToUrlQuery({
      replace: true,
      parameters: [
        {
          paramName: QueryParameterName.StartDate,
          value: dateRange.startDate,
        },
        { paramName: QueryParameterName.EndDate, value: dateRange.endDate },
      ],
    });
  }, [dateRange, setMultipleParametersToUrlQuery]);

  const {
    settings: {
      isOccasionalSubstitutePeriodFormDirty,
      isCommonSubstitutePeriodFormDirty,
    },
  } = useAppSelector(selectTimetable);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      <Row className="justify-between py-8">
        <PageTitle.H1>{t('timetables.daySettings')}</PageTitle.H1>
        <CloseIconButton
          testId={testIds.closeButton}
          label={t('close')}
          className="text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <div className="space-y-4 rounded-md bg-hsl-neutral-blue px-8 pb-4 pt-10">
        <h4>{t('timetables.filter')}</h4>
        <ObservationPeriodForm
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className="divide-y">
        <CommonSubstitutePeriodSection className="my-8" dateRange={dateRange} />
      </div>
      <hr />
      <div className="divide-y">
        <OccasionalSubstitutePeriodSection
          dateRange={dateRange}
          setDateRange={setDateRange}
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
    </Container>
  );
};
