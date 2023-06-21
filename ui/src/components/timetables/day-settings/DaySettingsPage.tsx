import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { ConfirmationDialog } from '../../../uiComponents';
import { CloseIconButton } from '../../../uiComponents/CloseIconButton';
import { ObservationPeriodForm } from '../../forms/timetables/ObservationPeriodForm';
import { RandomReferenceDay } from './RandomReferenceDay';

const testIds = {
  closeButton: 'SettingsMainPage::closeButton',
};

export const DaySettingsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const history = useHistory();

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    if (isDirty) {
      setIsOpen(true);
    } else {
      history.push(Path.timetables);
    }
  };

  const closePage = () => {
    history.push(Path.timetables);
  };

  return (
    <Container className="">
      <Row className="py-8">
        <h1>{t('timetables.daySettings')}</h1>
        <CloseIconButton
          testId={testIds.closeButton}
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <div className="space-y-4 rounded-md bg-hsl-neutral-blue px-8 py-10">
        <h4>{t('timetables.filter')}</h4>
        <ObservationPeriodForm isDirty={isDirty} />
      </div>
      <div className="divide-y">
        <RandomReferenceDay setIsDirty={setIsDirty} />
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
