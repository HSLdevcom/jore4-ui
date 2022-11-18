import { useTranslation } from 'react-i18next';
import { Container } from '../../../layoutComponents';
import { SearchContainer } from '../../routes-and-lines/search/SearchContainer';

export const TimetablesMainPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <h1>{t('timetables.timetables')}</h1>
      <SearchContainer />
    </Container>
  );
};
