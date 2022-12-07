import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { pipe, uniq } from 'remeda';
import { LineAllFieldsFragment } from '../../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useGetLineDetails,
  useMapQueryParams,
  useRouteLabelsQueryParam,
} from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import {
  resetMapRouteEditorStateAction,
  selectIsViaModalOpen,
  setLineInfoAction,
} from '../../../redux';
import { Priority } from '../../../types/Priority';
import { isPastEntity } from '../../../utils';
import { PageHeader } from '../common/PageHeader';
import { ViaModal } from '../via/ViaModal';
import { ActionsRow } from './ActionsRow';
import { AdditionalInformation } from './AdditionalInformation';
import { CreateRouteBox } from './CreateRouteBox';
import { LineTitle } from './LineTitle';
import { MapPreview } from './MapPreview';
import { RouteStopsTable } from './RouteStopsTable';

export const LineDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapQueryParams();
  const { displayedRouteLabels, setDisplayedRoutesToUrl } =
    useRouteLabelsQueryParam();

  const { line } = useGetLineDetails();

  const createRoute = (routeLine: LineAllFieldsFragment) => {
    dispatch(resetMapRouteEditorStateAction());
    dispatch(setLineInfoAction(routeLine));
    addMapOpenQueryParameter();
  };

  const isViaModalOpen = useAppSelector(selectIsViaModalOpen);

  const getHeaderBorderClassName = () => {
    if (line?.priority === Priority.Draft) {
      return 'border-b-4 border-medium-grey border-dashed';
    }
    if (line?.priority === Priority.Temporary) {
      return 'border-b-4 border-city-bicycle-yellow';
    }
    return '';
  };

  const isRouteCreationAllowed = line && !isPastEntity(DateTime.now(), line);
  const onCreateRoute = isRouteCreationAllowed
    ? () => createRoute(line)
    : undefined;

  const uniqueLineRouteLabels = pipe(
    line?.line_routes,
    (routes) => routes?.map((route) => route.label) || [],
    (routeLabels) => uniq(routeLabels),
  );

  const displayedRoutes =
    line?.line_routes?.filter((route) =>
      displayedRouteLabels?.includes(route.label),
    ) || [];

  // If no route has been initially selected to display, show all line's routes
  // Set the default value to query params if route labels query param doesn't exist
  useEffect(() => {
    if (!displayedRouteLabels && uniqueLineRouteLabels.length !== 0) {
      setDisplayedRoutesToUrl(uniqueLineRouteLabels);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueLineRouteLabels]);

  return (
    <div>
      <PageHeader className={getHeaderBorderClassName()}>
        <Row>
          <i className="icon-bus-alt text-6xl text-tweaked-brand" />
          {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
        </Row>
      </PageHeader>
      <ActionsRow className="!pt-4 !pb-0" />
      {line && (
        <Container className="pt-10">
          <Row>
            <AdditionalInformation className="w-2/3" line={line} />
            <MapPreview className="w-1/3" />
          </Row>
          <Row>
            <Column className="w-full">
              <h1 className="mt-8">{t('lines.routes')}</h1>
              {line.line_routes?.length > 0 ? (
                <RouteStopsTable routes={displayedRoutes} />
              ) : (
                <CreateRouteBox onCreateRoute={onCreateRoute} />
              )}
            </Column>
          </Row>
        </Container>
      )}
      <Visible visible={isViaModalOpen}>
        <ViaModal />
      </Visible>
    </div>
  );
};
