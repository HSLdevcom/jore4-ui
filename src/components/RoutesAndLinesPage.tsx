import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapEditorContext } from '../context/MapEditorContext';
import { ModalMapContext } from '../context/ModalMapContext';
import {
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
} from '../generated/graphql';
import {
  mapListChangingRoutesResult,
  mapListOwnLinesResult,
} from '../graphql/route';
import { Column, Container, Row } from '../layoutComponents';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { RoutesTable } from './RoutesTable'; // eslint-disable-line import/no-cycle

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
      <h2 className="text-bold mb-14 mt-12 text-4xl">
        {t('routes.changingRoutes')}
      </h2>
      {changingRoutes && <RoutesTable routes={changingRoutes} />}
      <h2 className="text-bold mb-14 mt-12 text-4xl">{t('routes.ownLines')}</h2>
      {ownLines?.length > 0 &&
        // TODO create proper components for displaying lines, these are just placeholders
        ownLines.map((item) => {
          return (
            <Link
              to={routes[Path.lineDetails].getLink(item.line_id)}
              key={item.line_id}
            >
              <Column className="border">
                <span>{item.label}</span>
                <span>{item.name_i18n}</span>
                <span>{item.description_i18n}</span>
              </Column>
            </Link>
          );
        })}
    </Container>
  );
};
