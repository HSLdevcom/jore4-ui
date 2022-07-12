import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  useAppDispatch,
  useAppSelector,
  useGetLineDetails,
  useMapUrlQuery,
  useObservationDateQueryParam,
} from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import {
  resetMapEditorStateAction,
  selectIsViaModalOpen,
  setIsModalMapOpenAction,
  setRouteMetadataAction,
} from '../../../redux';
import { Priority } from '../../../types/Priority';
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
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapUrlQuery();

  const { line } = useGetLineDetails();
  const { observationDate } = useObservationDateQueryParam();

  const onCreateRoute = () => {
    dispatch(resetMapEditorStateAction());
    dispatch(setRouteMetadataAction({ on_line_id: id }));
    dispatch(setIsModalMapOpenAction(true));
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

  return (
    <div>
      <PageHeader className={getHeaderBorderClassName()}>
        <Row>
          <i className="icon-bus-alt text-5xl text-tweaked-brand" />
          {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
        </Row>
      </PageHeader>
      <ActionsRow className="!pt-4 !pb-0" />
      {line && (
        <Container className="pt-10">
          <Column>
            <Row>
              <AdditionalInformation className="w-2/3" line={line} />
              <MapPreview className="w-1/3" />
            </Row>
            <Row>
              <Column className="w-full">
                <h1 className="mt-8 text-3xl font-semibold">
                  {t('lines.routes')}
                </h1>
                {line.line_routes?.length > 0 && observationDate ? (
                  <RouteStopsTable
                    routes={line.line_routes}
                    observationDate={observationDate}
                  />
                ) : (
                  <CreateRouteBox onCreateRoute={onCreateRoute} />
                )}
              </Column>
            </Row>
          </Column>
        </Container>
      )}
      <Visible visible={isViaModalOpen}>
        <ViaModal />
      </Visible>
    </div>
  );
};
