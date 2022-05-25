import { useTranslation } from 'react-i18next';
import { useAppDispatch, useMapUrlQuery } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import {
  resetMapEditorStateAction,
  setIsModalMapOpenAction,
} from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { SearchContainer } from '../search/conditions/SearchContainer';
import { RoutesAndLinesLists } from './RoutesAndLinesLists';

export const RoutesAndLinesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapUrlQuery();
  const createLineReactRoute = routeDetails[Path.createLine];
  const onOpenModalMap = () => {
    dispatch(setIsModalMapOpenAction(true));
    dispatch(resetMapEditorStateAction());
    addMapOpenQueryParameter();
  };

  return (
    <Container>
      <Row>
        <h1 className="text-5xl font-bold">{t('routes.routes')}</h1>
        <SimpleButton containerClassName="ml-auto" onClick={onOpenModalMap}>
          {t('map.open')}
        </SimpleButton>
        <SimpleButton
          id="create-line-button"
          data-testid="create-line-button"
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
