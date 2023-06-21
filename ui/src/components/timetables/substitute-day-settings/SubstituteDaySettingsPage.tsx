import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { ConfirmationDialog } from '../../../uiComponents';
import { CloseIconButton } from '../../../uiComponents/CloseIconButton';
import { ObservationPeriodForm } from '../../forms/timetables/ObservationPeriodForm';
import { OccasionalSubstitutePeriodSection } from './OccasionalSubstitutePeriod';

const testIds = {
  closeButton: 'DaySettingsPage::closeButton',
};

export const SubstituteDaySettingsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const {
    settings: { isOccasionalSubstitutePeriodFormDirty },
  } = useAppSelector(selectTimetable);
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    if (isOccasionalSubstitutePeriodFormDirty) {
      setIsOpen(true);
    } else {
      history.push(Path.timetables);
    }
  };

  const closePage = () => {
    history.push(Path.timetables);
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
      <div className="space-y-4 rounded-md bg-hsl-neutral-blue px-8 py-10">
        <h4>{t('timetables.filter')}</h4>
        <ObservationPeriodForm />
      </div>
      <div className="divide-y">
        <OccasionalSubstitutePeriodSection />
      </div>
      <ConfirmationDialog
        isOpen={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={closePage}
        title={t('confirmSettingsPageLeave.title')}
        description={t('confirmSettingsPageLeave.description')}
        confirmText={t('confirmSettingsPageLeave.confirmText')}
        cancelText={t('confirmSettingsPageLeave.cancelText')}
      />
    </Container>
  );
};
