import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { PageTitle } from '../../common';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import { SearchContainer } from '../search/SearchContainer';
import { RoutesAndLinesLists } from './RoutesAndLinesLists';

const testIds = {
  createLineButton: 'RoutesAndLinesPage::createLineButton',
};

export const RoutesAndLinesMainPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const createLineReactRoute = routeDetails[Path.createLine];

  return (
    <Container>
      <Row>
        <PageTitle.H1>{t('routes.routes')}</PageTitle.H1>
        <OpenDefaultMapButton containerClassName="ml-auto" />
        <SimpleButton
          id="create-line-button"
          data-testid={testIds.createLineButton}
          containerClassName="ml-3"
          href={createLineReactRoute.getLink()}
        >
          {t('lines.createNew')}
        </SimpleButton>
      </Row>
      <SearchContainer />
      <RoutesAndLinesLists />
    </Container>
  );
};
