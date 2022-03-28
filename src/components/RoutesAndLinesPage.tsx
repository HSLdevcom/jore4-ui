import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../context/MapEditor';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  RouteLine,
  RouteRoute,
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../generated/graphql';
import { mapListChangingRoutesResult, mapListOwnLinesResult } from '../graphql';
import { Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { LineTableRow } from './LineTableRow'; // eslint-disable-line import/no-cycle
import { RoutesTable } from './RoutesTable';
import { RoutesTableRow } from './RoutesTableRow'; // eslint-disable-line import/no-cycle

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { dispatch: modalMapDispatch } = useContext(ModalMapContext);
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);
  const createLineReactRoute = routes[Path.createLine];
  const changingRoutesResult = useListChangingRoutesQuery();
  const changingRoutes = mapListChangingRoutesResult(changingRoutesResult);
  const ownLinesResult = useListOwnLinesQuery();
  const ownLines = mapListOwnLinesResult(ownLinesResult);

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
      <h2 className="mb-14 mt-12 text-4xl font-bold">
        {t('routes.changingRoutes')}
      </h2>
      {changingRoutes && changingRoutes.length > 0 && (
        <RoutesTable>
          {changingRoutes.map((item: RouteRoute) => (
            <RoutesTableRow key={item.route_id} route={item} />
          ))}
        </RoutesTable>
      )}
      <h2 className="mb-14 mt-12 text-4xl font-bold">{t('routes.ownLines')}</h2>
      {ownLines && ownLines.length > 0 && (
        <RoutesTable>
          {ownLines.map((item: RouteLine) => (
            <LineTableRow key={item.line_id} line={item} />
          ))}
        </RoutesTable>
      )}
    </Container>
  );
};
