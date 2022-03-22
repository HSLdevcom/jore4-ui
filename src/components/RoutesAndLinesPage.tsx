import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../generated/graphql';
import { mapListChangingRoutesResult, mapListOwnLinesResult } from '../graphql';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { SearchContainer } from './routes-and-lines/search/conditions/SearchContainer';
import { LinesResultTable } from './routes-and-lines/search/results/LinesResultTable'; // eslint-disable-line import/no-cycle
import { RoutesResultTable } from './routes-and-lines/search/results/RoutesResultTable'; // eslint-disable-line import/no-cycle

const RouteResults = () => {
  const { t } = useTranslation();
  const changingRoutesResult = useListChangingRoutesQuery();
  const changingRoutes = mapListChangingRoutesResult(changingRoutesResult);

  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = mapListOwnLinesResult(ownLinesResult);

  return (
    <>
      <h2 className="text-bold mb-14 mt-12 text-4xl">
        {t('routes.changingRoutes')}
      </h2>
      <RoutesResultTable routes={changingRoutes} />
      <h2 className="text-bold mb-14 mt-12 text-4xl">{t('routes.ownLines')}</h2>
      <LinesResultTable lines={ownLines} />
    </>
  );
};

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);
  const createLineReactRoute = routes[Path.createLine];
  const onOpenModalMap = () => {
    mapEditorDispatch({ type: 'reset' });
    modalMapDispatch({ type: 'open' });
  };

  return (
    <Container>
      <Row>
        <h1 className="text-5xl font-bold">{t('routes.routes')}</h1>
        <SimpleButton className="ml-auto" onClick={onOpenModalMap}>
          {t('map.open')}
        </SimpleButton>
        <SimpleButton
          id="create-line-button"
          className="ml-3"
          href={createLineReactRoute.getLink()}
        >
          {t('lines.createNew')}
        </SimpleButton>
      </Row>
      <SearchContainer />
      <RouteResults />
    </Container>
  );
};
