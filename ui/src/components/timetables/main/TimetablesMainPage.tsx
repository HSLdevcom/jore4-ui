import { useTranslation } from 'react-i18next';
import { Container } from '../../../layoutComponents';
import { TimetablesSearchContainer } from '../search';

export const TimetablesMainPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>{t('timetables.timetables')}</h1>
      <TimetablesSearchContainer />
    </Container>
  );
};
