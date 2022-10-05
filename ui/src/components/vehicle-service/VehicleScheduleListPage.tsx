import { useTranslation } from 'react-i18next';
import { Container } from '../../layoutComponents';
import { SimpleButton } from '../../uiComponents';

export const VehicleScheduleListPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>{t('timetables.timetables')}</h1>
      <p>Placeholder page. Nothing to see here... yet.</p>
      <SimpleButton containerClassName="mt-4" href="/lines/example/timetables">
        Example timetable
      </SimpleButton>
    </Container>
  );
};
