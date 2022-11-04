import { useTranslation } from 'react-i18next';
import {
  useAppDispatch,
  useFilterStops,
  useMapQueryParams,
} from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { FilterType, resetMapState } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { SearchContainer } from '../search/SearchContainer';
import { RoutesAndLinesLists } from './RoutesAndLinesLists';

const testIds = {
  createLineButton: 'RoutesAndLinesPage::createLineButton',
};

export const RoutesAndLinesMainPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapQueryParams();
  const { toggleFunction } = useFilterStops();
  const toggleShowAllStops = toggleFunction(FilterType.ShowAllBusStops);

  const createLineReactRoute = routeDetails[Path.createLine];
  const onOpenModalMap = () => {
    dispatch(resetMapState());
    addMapOpenQueryParameter();
    /**
     * By default only stops that belong to displayed route are shown on map.
     * Now that no routes are shown on map, show all stops by default.
     */
    toggleShowAllStops(true);
  };

  return (
    <Container>
      <Row>
        <h1>{t('routes.routes')}</h1>
        <SimpleButton containerClassName="ml-auto" onClick={onOpenModalMap}>
          {t('map.open')}
        </SimpleButton>
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
