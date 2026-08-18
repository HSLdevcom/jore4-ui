import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../common/Buttons';
import { OpenDefaultMapButton, PageTitle } from '../../common/Jore';
import { SearchContainer } from '../../common/Jore/RouteLineSearch';
import { Container, Row } from '../../common/LayoutComponents';
import { RoutesAndLinesLists } from './RoutesAndLinesLists';

const testIds = {
  createLineButton: 'RoutesAndLinesPage::createLineButton',
};

export const RoutesAndLinesMainPage: FC = () => {
  const { t } = useTranslation();
  const createLineReactRoute = routeDetails[Path.createLine];

  return (
    <Container>
      <Row className="items-end">
        <PageTitle.H1>{t(($) => $.routes.routes)}</PageTitle.H1>
        <OpenDefaultMapButton className="ml-auto" />
        <SimpleButton
          id="create-line-button"
          data-testid={testIds.createLineButton}
          className="ml-3"
          href={createLineReactRoute.getLink()}
        >
          {t(($) => $.lines.createNew)}
        </SimpleButton>
      </Row>
      <SearchContainer />
      <RoutesAndLinesLists />
    </Container>
  );
};
