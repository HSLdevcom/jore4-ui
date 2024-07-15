import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { LineAllFieldsFragment } from '../../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useGetLineDetails,
  useGetRoutesDisplayedInList,
  useMapQueryParams,
} from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import {
  resetMapRouteEditorStateAction,
  selectIsTimingSettingsModalOpen,
  selectIsViaModalOpen,
  setLineInfoAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { isPastEntity } from '../../../utils';
import { PageHeader } from '../common/PageHeader';
import { TimingSettingsModal } from '../stop-timing-settings/TimingSettingsModal';
import { ViaModal } from '../via/ViaModal';
import { ActionsRow } from './ActionsRow';
import { AdditionalInformation } from './AdditionalInformation';
import { CreateRouteBox } from './CreateRouteBox';
import { LineTitle } from './LineTitle';
import { MapPreview } from './MapPreview';
import { RouteStopsTable } from './RouteStopsTable';

export const LineDetailsPage = (): React.ReactElement => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { addMapOpenQueryParameter } = useMapQueryParams();

  const { line } = useGetLineDetails();

  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);

  const createRoute = (routeLine: LineAllFieldsFragment) => {
    dispatch(resetMapRouteEditorStateAction());
    dispatch(setLineInfoAction(routeLine));
    addMapOpenQueryParameter();
  };

  const isViaModalOpen = useAppSelector(selectIsViaModalOpen);
  const isTimingSettingsModalOpen = useAppSelector(
    selectIsTimingSettingsModalOpen,
  );

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

  const displayedRoutes =
    line?.line_routes?.filter((route) =>
      displayedRouteLabels?.includes(route.label),
    ) ?? [];

  return (
    <div>
      <PageHeader className={getHeaderBorderClassName()}>
        <Row>
          <i className="icon-bus-alt text-6xl text-tweaked-brand" />
          {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
        </Row>
      </PageHeader>
      <ActionsRow className="!pb-0 !pt-4" />
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
      <Visible visible={isTimingSettingsModalOpen}>
        <TimingSettingsModal />
      </Visible>
    </div>
  );
};
