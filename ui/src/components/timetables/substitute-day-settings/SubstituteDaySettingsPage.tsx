import { DateTime } from 'luxon';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { ConfirmationDialog } from '../../../uiComponents';
import { CloseIconButton } from '../../../uiComponents/CloseIconButton';
import { ObservationPeriodForm } from '../../forms/timetables/ObservationPeriodForm';
import { CommonSubstitutePeriodSection } from './CommonSubstitutePeriod/CommonSubstitutePeriodSection';
import { DateRange } from './DateRange';
import { OccasionalSubstitutePeriodSection } from './OccasionalSubstitutePeriod';

const testIds = {
  closeButton: 'SubstituteDaySettingsPage::closeButton',
};

export const SubstituteDaySettingsPage = (): React.ReactElement => {
  const { t } = useTranslation();

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: DateTime.now(),
    endDate: DateTime.now().plus({ years: 1 }),
  });

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
