import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { LineAllFieldsFragment } from '../../../../generated/graphql';
import {
  resetMapRouteEditorStateAction,
  selectIsTimingSettingsModalOpen,
  selectIsViaModalOpen,
  setLineInfoAction,
  startRouteCreatingAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import { getTransportModeIcon, isPastEntity } from '../../../../utils';
import { useNavigateToMap } from '../../../common/hooks';
import {
  Column,
  Container,
  Row,
  Visible,
} from '../../../common/LayoutComponents';
import {
  LineFetchError,
  LineTitle,
  useGetLineDetails,
  useGetRoutesDisplayedInList,
} from '../../Common';
import { LineLatestChanges } from '../ChangeHistory/Components/LatestChangeHistory/LineLatestChanges';
import { TimingSettingsModal } from '../StopTimingSettings/TimingSettingsModal';
import { ViaModal } from '../Via/ViaModal';
import { ActionsRow } from './ActionsRow';
import { AdditionalInformation } from './AdditionalInformation';
import { CreateRouteBox } from './CreateRouteBox';
import { LineDetailsEmptyMapPlaceholder } from './LineDetailsEmptyMapPlaceholder';
import { LineMissingBox } from './LineMissingBox';
import { LineRouteList } from './LineRouteList';
import { MapPreview } from './MapPreview';

export const LineDetailsByIdPage: FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigateToMap = useNavigateToMap();

  const { line, lineError } = useGetLineDetails();

  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);

  const createRoute = (routeLine: LineAllFieldsFragment) => {
    dispatch(resetMapRouteEditorStateAction());
    dispatch(setLineInfoAction(routeLine));
    dispatch(startRouteCreatingAction(routeLine.primary_vehicle_mode));
    navigateToMap();
  };

  const isViaModalOpen = useAppSelector(selectIsViaModalOpen);
  const isTimingSettingsModalOpen = useAppSelector(
    selectIsTimingSettingsModalOpen,
  );

  const isRouteCreationAllowed = line && !isPastEntity(DateTime.now(), line);
  const onCreateRoute = isRouteCreationAllowed
    ? () => createRoute(line)
    : undefined;

  const displayedRoutes =
    line?.line_routes?.filter((route) =>
      displayedRouteLabels?.includes(route.label),
    ) ?? [];

  const isDraft = line?.priority === Priority.Draft;

  return (
    <div>
      <div
        className={twMerge(
          'border-b border-light-grey bg-background',
          // Remove border because draft-divider handles separation in draft mode
          isDraft ? 'border-0' : '',
        )}
      >
        <Container>
          <Row>
            {line?.primary_vehicle_mode && (
              <i
                className={twJoin(
                  getTransportModeIcon(
                    line.primary_vehicle_mode,
                    line.type_of_line,
                  ),
                  'mx-2 mt-2 text-6xl',
                )}
              />
            )}
            {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
          </Row>
        </Container>
      </div>
      {isDraft && <div className="draft-divider" />}
      <ActionsRow className="pt-4 pb-0" />
      <Container className="pt-10">
        {line ? (
          <>
            <Row>
              <AdditionalInformation className="w-2/4" line={line} />
              <LineLatestChanges className="w-1/4" label={line.label} />
              <MapPreview className="w-1/4" />
            </Row>
            <Row>
              <Column className="w-full">
                <h2 className="mt-8">{t(($) => $.lines.routes)}</h2>
                {line.line_routes?.length > 0 ? (
                  <LineRouteList routes={displayedRoutes} />
                ) : (
                  <CreateRouteBox onCreateRoute={onCreateRoute} />
                )}
              </Column>
            </Row>
          </>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="col col-span-3">
              <LineMissingBox
                error={lineError ?? LineFetchError.LINE_MISSING_DEFAULT}
              />
            </div>
            <div className="col col-span-1">
              <LineDetailsEmptyMapPlaceholder />
            </div>
          </div>
        )}
      </Container>
      <Visible visible={isViaModalOpen}>
        <ViaModal />
      </Visible>
      <Visible visible={isTimingSettingsModalOpen}>
        <TimingSettingsModal />
      </Visible>
    </div>
  );
};
