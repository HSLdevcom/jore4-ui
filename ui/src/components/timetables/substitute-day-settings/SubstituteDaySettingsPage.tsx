import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ObservationPeriodForm } from '@/components/forms/timetables/ObservationPeriodForm';
import { CommonSubstitutePeriodSection } from '@/components/timetables/substitute-day-settings/CommonSubstitutePeriod';
import { OccasionalSubstitutePeriodSection } from '@/components/timetables/substitute-day-settings/OccasionalSubstitutePeriod';
import { useAppSelector } from '@/hooks/redux';
import { Container } from '@/layoutComponents/Container';
import { Row } from '@/layoutComponents/Row';
import { Path } from '@/router/routeDetails';
import { CloseIconButton } from '@/uiComponents/CloseIconButton';
import { ConfirmationDialog } from '@/uiComponents/ConfirmationDialog';
import { selectTimetable } from '../../../redux';

const testIds = {
  closeButton: 'SubstituteDaySettingsPage::closeButton',
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
        <ObservationPeriodForm />
      </div>
      <div className="divide-y">
        <CommonSubstitutePeriodSection className="my-8" />
      </div>
      <hr />
      <div className="divide-y">
        <OccasionalSubstitutePeriodSection />
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
