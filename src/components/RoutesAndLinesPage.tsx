import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../context/MapEditor';
import { useAppDispatch } from '../hooks';
import { Container, Row } from '../layoutComponents';
import { setIsModalMapOpenAction } from '../redux';
import { Path, routes } from '../routes'; // eslint-disable-line import/no-cycle
import { SimpleButton } from '../uiComponents';
import { RoutesAndLinesLists } from './routes-and-lines/RoutesAndLinesLists'; // eslint-disable-line import/no-cycle
import { SearchContainer } from './routes-and-lines/search/conditions/SearchContainer';

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dispatch: mapEditorDispatch } = useContext(MapEditorContext);
  const createLineReactRoute = routes[Path.createLine];
  const onOpenModalMap = () => {
    dispatch(setIsModalMapOpenAction(true));
    mapEditorDispatch({ type: 'reset' });
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
      <RoutesAndLinesLists />
    </Container>
  );
};
